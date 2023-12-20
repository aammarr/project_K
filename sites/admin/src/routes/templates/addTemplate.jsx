/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import axiosInstance from 'src/axios/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'
import axios from 'axios'

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [categories, setCategories] = useState([]) // State for categories dropdown
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  let progress

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('category?page=1&limit=10000&search=')
        setCategories(response?.data?.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Error fetching categories')
      }
    }

    fetchCategories()
  }, [])

  const handleFileUpload = async (event) => {
    setFile(event.target.files[0])
    const newFile = event.target.files[0]
    console.log(newFile)

    if (newFile?.size > 5242880) {
      console.log('file is bigger than 5 mb')

      console.log(newFile)

      const chunkSize = 5 * 1024 * 1024
      const chunks = []
      let uploadedChunks = 0
      const uploadedEtags = []

      const formData = new FormData()
      formData.append('key', newFile?.name)

      // upload to s3
      const responseOne = await axiosInstance.post('template/initiateUpload', formData)
      const responseOneData = responseOne?.data?.response?.createMultipartUploadResponse
      const totalChunks = Math.ceil(newFile.size / chunkSize)

      const formDataTwo = new FormData()
      formDataTwo.append('name', newFile?.name)
      formDataTwo.append('content_type', newFile?.type)
      formDataTwo.append('uploadId', responseOneData?.UploadId)
      formDataTwo.append('totalParts', totalChunks)
      formDataTwo.append('key', responseOneData?.Key)

      // upload to multi signed part s3
      const responseTwo = await axiosInstance.post('template/getSignedUrlMultipart', formDataTwo)
      console.log(responseTwo)
      const responseTwoSignedUrls = responseTwo?.data?.data?.signedUrls
      console.log(responseTwoSignedUrls)

      const uploadViaSignedUrlMultipart = async (preSignedUrl, key, doc, partNumber) => {
        const fileKey = key
        let uploadResponse = await axios.put(preSignedUrl, doc, {
          headers: {
            'Content-Type': newFile.type, // Set the content type to binary data
          },
        })
        uploadedChunks++
        progress = Math.floor((uploadedChunks / totalChunks) * 100)

        uploadedEtags.push({
          PartNumber: partNumber,
          ETag: uploadResponse.headers.etag.replace(/"/g, ''),
        })
        const sortedParts = uploadedEtags.sort((a, b) => a.PartNumber - b.PartNumber)
        console.log(sortedParts)
        console.log(progress)
        if (progress === 100) {
          let completeUploadpPostData = {
            key: responseOneData?.Key,
            uploadId: responseOneData?.UploadId,
            ETagsArray: sortedParts,
          }
          console.log(completeUploadpPostData)
          let completeUploadResponse = await axiosInstance.post(
            'template/complete-multipart-upload',
            completeUploadpPostData,
          )

          console.log(completeUploadResponse)
          if (completeUploadResponse?.status === 200) {
            const body = {
              content_type: newFile?.type,
              name: newFile?.name,
              size: newFile?.size,
              key: responseOneData?.Key,
              url: completeUploadResponse?.data?.data?.Location,
            }
            const responseFinal = await axiosInstance.post('template/file-save-into-db', body)
            console.log(responseFinal)
          }
        } else {
          console.log('save to db error')
        }
      }
      for (let i = 1; i <= totalChunks; i++) {
        const start = (i - 1) * chunkSize
        const end = Math.min(i * chunkSize, newFile?.size)
        const chunk = newFile.slice(start, end)
        chunks.push(chunk)
        uploadViaSignedUrlMultipart(responseTwoSignedUrls[i - 1], responseOneData?.Key, chunk, i)
      }
      console.log(chunks)

      const uploadPromises = []

      // for (let i = 0; i < responseTwoSignedUrls.length; i++) {
      //   const signedUrl = responseTwoSignedUrls[i]
      //   const chunk = chunks[i]

      //   const uploadPromise = uploadViaSignedUrlMultipart(signedUrl, newFile.name, chunk, i + 1)
      //   uploadPromises.push(uploadPromise)
      // }

      // try {
      //   // Wait for all uploads to complete
      //   await Promise.all(uploadPromises)
      //   console.log('All uploads completed successfully')
      // } catch (error) {
      //   console.error('Error uploading chunks:', error)
      //   // Handle error
      // }
    }
  }

  const handleAddTemplate = async () => {
    console.log('Adding template:', {
      templateName,
      templateDescription,
      templateCode,
      categoryId,
      file,
    })

    try {
      if (!templateName || !templateDescription || !templateCode || !categoryId) {
        toast.error('Please fill in all fields', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      setLoading(true)

      const response = await axiosInstance.post('template', {
        template_name: templateName,
        template_description: templateDescription,
        template_code: templateCode,
        category_id: categoryId, // Include the selected category ID
      })

      toast.success('Template added successfully', { position: toast.POSITION.TOP_RIGHT })
      navigate('/templates/1/25')
    } catch (error) {
      console.error('Error adding template:', error)
      toast.error(error?.response?.data?.message || 'Failed to add template', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>Add template</CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel htmlFor="templateName">Template Name</CFormLabel>
              <CFormInput
                type="text"
                id="templateName"
                placeholder="Enter template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />

              <CFormLabel htmlFor="templateDescription">Template Description</CFormLabel>
              <CFormInput
                type="text"
                id="templateDescription"
                placeholder="Enter template description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />

              <CFormLabel htmlFor="templateCode">Template Code</CFormLabel>
              <CFormInput
                type="text"
                id="templateCode"
                placeholder="Enter template code"
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
              />

              <CFormLabel htmlFor="categoryId">Category</CFormLabel>
              <CFormSelect
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </CFormSelect>

              <CFormLabel htmlFor="file">Upload File</CFormLabel>
              <CFormInput type="file" id="file" onChange={handleFileUpload} />

              <CButton color="primary" onClick={handleAddTemplate} style={{ marginTop: '20px' }}>
                {loading ? (
                  <>
                    <CSpinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                      aria-hidden="true"
                    />
                    <span style={{ marginLeft: '5px' }}> Adding... </span>
                  </>
                ) : (
                  'Add Template'
                )}{' '}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddTemplate

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
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import GetAppIcon from '@mui/icons-material/GetApp'
import axiosInstance from 'src/axios/axiosConfig'
import axios from 'axios'
import { LinearProgress } from '@mui/material' // Import LinearProgress

const UpdateTemplate = () => {
  const { id } = useParams() // Retrieve the template ID from params
  const navigate = useNavigate()

  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [templateKey, setTemplateKey] = useState('')
  const [templateDownloadCount, setTemplateDownloadCount] = useState('')
  const [templateViewCount, setTemplateViewCount] = useState('')
  const [templateSize, setTemplateSize] = useState('')
  const [templateUrl, setTemplateUrl] = useState('')
  const [templateType, setTemplateType] = useState('')
  const [progress, setProgress] = useState(0) // Progress state

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editable, setEditable] = useState(false) // New state for edit mode
  const [editIconVisible, setEditIconVisible] = useState(true)

  const [isUploading, setIsUploading] = useState(false)

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
    setProgress((prevProgress) => 1)
    setIsUploading(true)
    try {
      setFile(event.target.files[0])
      const newFile = event.target.files[0]

      console.log(newFile)

      // file size is smaller than 5 Mb
      if (newFile?.size < 4999999) {
        setProgress(20)
        console.log('file size is smaller than 5 mb')
        const formData = new FormData()
        formData.append('name', newFile?.name)

        const fileName = newFile?.name.replace(/ /g, '_')

        // upload to get signed URL
        const responseOne = await axiosInstance.get(
          `template/getPutSignedUrl?type=get&name=${fileName}`,
        )
        setProgress((prevProgress) => 50)
        const signedUrl = responseOne?.data?.data?.url
        // const fileExtension = newFile?.name.slice(((newFile?.name.lastIndexOf('.') - 1) >>> 0) + 2)
        const fileExtension = newFile.type

        // const key = responseOne?.data?.data?.key + '.' + fileExtension
        const key = responseOne?.data?.data?.key
        const url = responseOne?.data?.data?.url
        console.log('responseOne : ', responseOne.data)

        setTemplateKey(key)
        setTemplateType(newFile?.type)
        setTemplateSize(newFile?.size)
        setTemplateUrl(url)

        // upload to API
        await axios
          .put(signedUrl, newFile, {
            headers: {
              'Content-Type': newFile.type,
            },
          })
          .then((response) => {
            if (response.status == 200) {
              setProgress((prevProgress) => 100)
            }
          })
          .catch((error) => {
            console.log('Upload error:', error)
          })
      }

      // file is bigger than 5 mb
      if (newFile?.size > 4999999) {
        console.log('file is bigger than 5 mb')

        const chunkSize = 5 * 1024 * 1024
        const chunks = []
        let uploadedChunks = 0
        const uploadedEtags = []

        const formData = new FormData()
        formData.append('name', newFile?.name)

        // upload to S3
        const responseOne = await axiosInstance.post('template/initiateUpload', formData)
        const responseOneData = responseOne?.data?.response?.createMultipartUploadResponse
        const totalChunks = Math.ceil(newFile.size / chunkSize)

        const formDataTwo = new FormData()
        formDataTwo.append('name', newFile?.name)
        formDataTwo.append('content_type', newFile?.type)
        formDataTwo.append('uploadId', responseOneData?.UploadId)
        formDataTwo.append('totalParts', totalChunks)
        formDataTwo.append('key', responseOneData?.Key)

        // upload to multi-signed part S3
        const responseTwo = await axiosInstance.post('template/getSignedUrlMultipart', formDataTwo)
        const responseTwoSignedUrls = responseTwo?.data?.data?.signedUrls

        const uploadViaSignedUrlMultipart = async (preSignedUrl, key, doc, partNumber) => {
          const fileKey = key
          let uploadResponse = await axios.put(preSignedUrl, doc, {
            headers: {
              'Content-Type': newFile.type, // Set the content type to binary data
            },
          })
          uploadedChunks++
          setProgress((prevProgress) => Math.floor((uploadedChunks / totalChunks) * 100))

          uploadedEtags.push({
            PartNumber: partNumber,
            ETag: uploadResponse.headers.etag.replace(/"/g, ''),
          })
          const sortedParts = uploadedEtags.sort((a, b) => a.PartNumber - b.PartNumber)
          console.log(sortedParts)
          console.log(progress)
          if (uploadedChunks === totalChunks) {
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
              setTemplateKey(responseOneData?.Key)
              setTemplateSize(newFile?.size)
              setTemplateType(newFile?.type)
              setTemplateUrl(completeUploadResponse?.data?.data?.Location)
            }
          }
        }

        for (let i = 1; i <= totalChunks; i++) {
          const start = (i - 1) * chunkSize
          const end = Math.min(i * chunkSize, newFile?.size)
          const chunk = newFile.slice(start, end)
          chunks.push(chunk)
          uploadViaSignedUrlMultipart(responseTwoSignedUrls[i - 1], responseOneData?.Key, chunk, i)
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(error?.message || 'Failed to upload file', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch template data using the provided template ID
      const response = await axiosInstance.get(`template/${id}`)
      const templateData = response?.data?.data

      // Set the form fields with the retrieved data
      setTemplateName(templateData.template_name)
      setTemplateDescription(templateData.template_description)
      setTemplateCode(templateData.template_code)
      setCategoryId(templateData.category_id)
      setTemplateKey(templateData.template_key)
      setTemplateDownloadCount(templateData.template_download_count)
      setTemplateViewCount(templateData.template_view_count)
    } catch (error) {
      console.error('Error fetching template data:', error)
      toast.error('Error fetching template data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleUpdateTemplate = async () => {
    console.log('Updating template:', {
      id,
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

      const requestBody = {
        template_name: templateName,
        template_description: templateDescription,
        template_code: templateCode,
        category_id: categoryId,
      }

      // Update template data using the provided template ID

      if (file) {
        requestBody.template_key = templateKey
        requestBody.template_size = templateSize
        requestBody.template_type = templateType
        requestBody.template_url = templateUrl
      }

      await axiosInstance.put(`template/${id}`, requestBody)

      toast.success('Template updated successfully', { position: toast.POSITION.TOP_RIGHT })
      navigate('/templates/1/25')
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error(error?.response?.data?.message || 'Failed to update template', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } finally {
      setLoading(false)
      setEditable(false) // Turn off edit mode after updating
      setEditIconVisible(true) // Show the edit icon again
    }
  }

  const handleCancel = () => {
    // Reset form fields and exit edit mode
    setEditable(false)
    setEditIconVisible(true)
  }

  const toggleEdit = () => {
    setEditable(!editable)
    setEditIconVisible(false) // Hide the edit icon when entering edit mode
  }

  const handleDownloadClick = async () => {
    const responseOne = await axiosInstance.get(
      `template/getSignedUrlDownload?type=get&name=${templateKey}`,
    )
    window.open(responseOne?.data?.data, '_blank')
    fetchData()
  }

  const buttonText = editable ? 'Update Template' : `Template Name: ${templateName}`

  return (
    <CRow className="justify-content-center">
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            {buttonText}
            {editIconVisible && (
              <ModeEditIcon style={{ float: 'right', cursor: 'pointer' }} onClick={toggleEdit} />
            )}
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel htmlFor="templateName">Template Name</CFormLabel>
              <CFormInput
                type="text"
                id="templateName"
                placeholder="Enter template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={!editable} // Set the "disabled" attribute based on the "editable" state
              />

              <CFormLabel htmlFor="templateDescription">Template Description</CFormLabel>
              <CFormInput
                type="text"
                id="templateDescription"
                placeholder="Enter template description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                disabled={!editable} // Set the "disabled" attribute based on the "editable" state
              />

              <CFormLabel htmlFor="templateCode">Template Code</CFormLabel>
              <CFormInput
                type="text"
                id="templateCode"
                placeholder="Enter template code"
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                disabled={!editable} // Set the "disabled" attribute based on the "editable" state
              />

              <CFormLabel htmlFor="categoryId">Category</CFormLabel>
              <CFormSelect
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!editable} // Set the "disabled" attribute based on the "editable" state
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </CFormSelect>

              {/* Conditionally render the "Choose File" button based on the "editable" state */}
              {editable && (
                <>
                  <CFormLabel htmlFor="file">Choose File</CFormLabel>
                  <CFormInput
                    type="file"
                    id="file"
                    onChange={handleFileUpload}
                    disabled={!editable} // Set the "disabled" attribute based on the "editable" state
                  />
                  {/* Display the file name when a file is selected, otherwise show "No file chosen" */}
                  {!file && <p>{file ? `Selected File: ${file.name}` : templateKey}</p>}
                  {progress > 0 && progress < 100 && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        style={{ marginTop: '10px' }}
                      />
                      <div
                        style={{ textAlign: 'center', marginTop: '5px' }}
                      >{`${progress}% Uploaded`}</div>
                    </>
                  )}
                </>
              )}

              {!editable && (
                <>
                  {/* Display download-related information when not editable */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center', // Center align the items horizontally
                      marginTop: '20px',
                    }}
                  >
                    <p style={{ paddingTop: '10px' }}>Download Count: {templateDownloadCount}</p>
                    <p style={{ paddingTop: '10px' }}>View Count: {templateViewCount}</p>
                    <CButton color="primary" onClick={handleDownloadClick}>
                      <GetAppIcon style={{ marginRight: '5px' }} />
                      Download Template
                    </CButton>
                  </div>
                </>
              )}

              {/* Conditionally render the update button based on the "editable" state */}
              {editable && (
                <div>
                  {' '}
                  <CButton
                    color="danger"
                    onClick={handleCancel}
                    style={{ marginRight: '10px', marginTop: '20px', color: 'white' }}
                    disabled={!editable}
                  >
                    Cancel
                  </CButton>
                  <CButton
                    color="primary"
                    onClick={handleUpdateTemplate}
                    style={{ marginTop: '20px' }}
                    disabled={isUploading}
                  >
                    {loading ? (
                      <>
                        <CSpinner
                          as="span"
                          size="sm"
                          animation="border"
                          role="status"
                          aria-hidden="true"
                        />
                        <span style={{ marginLeft: '5px' }}> Updating... </span>
                      </>
                    ) : (
                      'Update Template'
                    )}
                  </CButton>
                </div>
              )}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UpdateTemplate

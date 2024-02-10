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
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import { LinearProgress } from '@mui/material' // Import LinearProgress
import axiosInstance from 'src/axios/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { v4 as uuidv4 } from 'uuid'

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [categories, setCategories] = useState([]) // State for categories dropdown
  const [categoryId, setCategoryId] = useState('')
  const [templateType, setTemplateType] = useState('')
  const [templateKey, setTemplateKey] = useState('')
  const [templateSize, setTemplateSize] = useState('')
  const [templateUrl, setTemplateUrl] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0) // Progress state
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const [multipleThumbnailProgress, setMultipleThumbnailProgress] = useState(0)
  const [multipleFiles, setMultipleFiles] = useState([])
  const [finalFiles, setFinalFiles] = useState([])

  const [files, setFiles] = useState(null)
  const [fileArray, setFileArray] = useState([])

  useEffect(() => {
    const urlArray = multipleFiles.map((item) => item.url)

    setFinalFiles(urlArray)
  }, [multipleFiles])

  const handleAddFile = (event) => {
    event.preventDefault()

    if (fileArray.length < 9) {
      const fileId = uuidv4() // Generate a unique ID using uuid
      setFileArray([...fileArray, { id: fileId, file: null }])
      setMultipleFiles([...multipleFiles, { id: fileId, file: null }])
    }
  }

  const handleRemoveFile = (event, id) => {
    event.preventDefault()

    // Remove the corresponding file entry from multipleFiles array
    setMultipleFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))

    // Remove the corresponding file entry from fileArray
    setFileArray((prevArray) => prevArray.filter((file) => file.id !== id))
  }

  const handleFileChange = async (id, index, event) => {
    const file = event.target.files[0]

    setFileArray((prevArray) => {
      const updatedArray = [...prevArray]
      updatedArray[index] = { id, file } // Include id with the file in the array
      return updatedArray
    })

    // Upload the file
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post('/template/media', formData, {
        headers: {
          'Content-Type': file.type,
        },
      })

      const publicUrl = response.data.public_url

      // Update the multipleFiles array with the new URL at the specific index
      setMultipleFiles((prevFiles) => {
        const updatedFiles = [...prevFiles]
        updatedFiles[index] = { id, url: publicUrl } // Include id with the URL in the array
        return updatedFiles
      })

      // You might want to handle other state updates or logic here
    } catch (error) {
      console.error('Error uploading file:', error.message)
      // Handle error as needed
    }
  }

  const hasNullValues = multipleFiles.some((file) => file === null)

  const navigate = useNavigate()

  const handleMultipleThumbnails = async (event) => {
    if (event.target.files?.length > 9) {
      toast.error('You can only select up to 9 images!')
      return
    }

    try {
      setMultipleThumbnailProgress(1)
      setFiles(event.target.files)
      const files = event.target.files

      if (files) {
        for (let i = 0; i < files?.length; i++) {
          const formData = new FormData()
          formData.append('file', files[i])

          const response = await axiosInstance.post('/template/media', formData, {
            headers: {
              'Content-Type': files[i]?.type, // Fix: Use files[i]?.type
            },
          })

          // Assuming the response contains a public_url field
          const publicUrl = response.data.public_url

          // Fix: Correct the order of operations
          setMultipleThumbnailProgress((prevProgress) =>
            Math.floor(((i + 1) / files?.length) * 100),
          )

          multipleFiles.push(publicUrl)
        }
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error.message)
      // Handle error as needed
    }
  }

  // console.log(JSON.stringify(multipleFiles))

  // Assuming you have setThumbnail and templateThumbnail using useState

  const handleRemoveThumbnail = () => {
    setThumbnailUrl('')
    setThumbnail(null) // Reset the file
  }

  const handleThumbnailUpload = async (event) => {
    try {
      setThumbnailProgress(20)
      setThumbnail(event.target.files[0])
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axiosInstance.post('/template/media', formData, {
          headers: {
            'Content-Type': file?.type, // Set the content type to binary data
          },
        })

        // Assuming the response contains a public_url field
        const publicUrl = response.data.public_url
        setThumbnailProgress(80)

        // Set the templateThumbnail state
        setThumbnailUrl(publicUrl)
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error.message)
      // Handle error as needed
    } finally {
      setThumbnailProgress(100)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('admin/categories?page=1&limit=10000&search=')
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
    try {
      setFile(event.target.files[0])
      const newFile = event.target.files[0]

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

          if (uploadedChunks === totalChunks) {
            let completeUploadpPostData = {
              key: responseOneData?.Key,
              uploadId: responseOneData?.UploadId,
              ETagsArray: sortedParts,
            }

            let completeUploadResponse = await axiosInstance.post(
              'template/complete-multipart-upload',
              completeUploadpPostData,
            )

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
    }
  }

  const handleAddTemplate = async () => {
    try {
      if (!templateName || !templateDescription || !templateCode || !categoryId) {
        toast.error('Please fill in all fields', { position: toast.POSITION.TOP_RIGHT })
        return
      }
      if (!thumbnail) {
        toast.error('Please select a thumbnail.', { position: toast.POSITION.TOP_RIGHT })
        return
      }
      if (!file) {
        toast.error('Please select a file first.', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      if (!templateKey || !templateSize || !templateType) {
        toast.error('Please wait for the file to upload.', { position: toast.POSITION.TOP_RIGHT })
        return
      }
      // if (multipleFiles?.length !== 0 && multipleThumbnailProgress !== 100) {
      //   toast.error('Please wait for the thumbnails to upload.', {
      //     position: toast.POSITION.TOP_RIGHT,
      //   })
      //   return
      // }

      const hasNullValues = fileArray.some((file) => file?.file === null)

      if (hasNullValues) {
        toast.error('Please add all the images.', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const hasNotUploaded = finalFiles.some((file) => file === undefined)

      if (hasNotUploaded) {
        toast.error('Please wait for the images to upload', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      setLoading(true)
      const requestBody = {
        template_name: templateName,
        template_description: templateDescription,
        template_code: templateCode,
        category_id: categoryId,
        template_key: templateKey,
        template_size: templateSize,
        template_type: templateType,
        template_multiple_thumbnails: '[]',
      }

      if (finalFiles?.length !== 0) {
        requestBody.template_multiple_thumbnails = JSON.stringify(finalFiles)
      }

      // Include template_url only if it's not an empty string
      if (templateUrl !== '') {
        requestBody.template_url = templateUrl
      }

      if (thumbnailUrl !== '') {
        requestBody.template_thumbnail = thumbnailUrl
      }

      const response = await axiosInstance.post('template', requestBody)

      toast.success('Template added successfully', { position: toast.POSITION.TOP_RIGHT })
      navigate('/templates')
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
              <CFormTextarea
                type="text"
                id="templateDescription"
                placeholder="Enter template description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={7}
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

              <CFormLabel htmlFor="thumbnail">Cover Thumbnail</CFormLabel>
              {/* Thumbnail Input Section */}
              {!thumbnailUrl && (
                <>
                  <CFormInput
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                  {/* Display progress bar when thumbnail is being uploaded */}
                  {thumbnailProgress > 0 && thumbnailProgress < 100 && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={thumbnailProgress}
                        style={{ marginTop: '10px' }}
                      />
                      <div
                        style={{ textAlign: 'center', marginTop: '5px' }}
                      >{`${thumbnailProgress}% Uploaded`}</div>
                    </>
                  )}
                </>
              )}

              {/* Display Thumbnail Image */}
              {thumbnailUrl && (
                <div style={{ position: 'relative' }}>
                  {/* Cross Icon to Remove Thumbnail */}
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={handleRemoveThumbnail}
                  />
                  <img
                    src={thumbnailUrl}
                    alt="thumbnail"
                    style={{ width: '100px', marginTop: '10px' }}
                  />
                </div>
              )}
              {/* <CFormLabel htmlFor="file">Choose more thumbnails (Upto 9)</CFormLabel>
              <CFormInput
                type="file"
                id="multiplethumbnails"
                accept="image/*"
                onChange={handleMultipleThumbnails}
                multiple
              />
              {multipleThumbnailProgress > 0 && multipleThumbnailProgress < 100 && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={multipleThumbnailProgress}
                    style={{ marginTop: '10px' }}
                  />
                  <div
                    style={{ textAlign: 'center', marginTop: '5px' }}
                  >{`${multipleThumbnailProgress}% Uploaded`}</div>
                </>
              )} */}

              <CFormLabel htmlFor="file">Upload File</CFormLabel>
              <CFormInput type="file" id="file" onChange={handleFileUpload} />

              {/* Display progress bar when file is being uploaded */}
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
              <CFormLabel htmlFor="file">Add More Thumbnails</CFormLabel>

              <div>
                {fileArray.map((file, index) => (
                  <div key={file?.id} style={{ display: 'flex', marginBottom: '10px' }}>
                    <CFormInput
                      type="file"
                      onChange={(event) => handleFileChange(file?.id, index, event)}
                      accept="image/*"
                    />
                    <RemoveCircleOutlineIcon
                      onClick={(event) => handleRemoveFile(event, file?.id)}
                      style={{ marginLeft: '10px', cursor: 'pointer', marginTop: '5px' }}
                    />
                  </div>
                ))}
                {fileArray.length < 9 && (
                  <AddCircleOutlineIcon onClick={handleAddFile} style={{ cursor: 'pointer' }} />
                )}
              </div>
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

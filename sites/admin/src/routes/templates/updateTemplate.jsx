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
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import GetAppIcon from '@mui/icons-material/GetApp'
import axiosInstance from 'src/axios/axiosConfig'
import axios from 'axios'
import { LinearProgress } from '@mui/material' // Import LinearProgress
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { v4 as uuidv4 } from 'uuid'

const UpdateTemplate = () => {
  const location = useLocation()
  const id = location.state?.templateId
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
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [templateMultipleThumbnails, setTemplateMultipleThumbnails] = useState([])

  const [progress, setProgress] = useState(0) // Progress state
  const [thumbnailProgress, setThumbnailProgress] = useState(0)

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editable, setEditable] = useState(false) // New state for edit mode
  const [editIconVisible, setEditIconVisible] = useState(true)
  const [multipleFiles, setMultipleFiles] = useState([])
  const [finalFiles, setFinalFiles] = useState([])

  const [fileArray, setFileArray] = useState([])

  useEffect(() => {
    const urlArray = multipleFiles.map((item) => item.url)

    setFinalFiles(urlArray)
  }, [multipleFiles])

  useEffect(() => {
    // Initialize fileArray with existing thumbnails
    setFileArray(
      templateMultipleThumbnails.map((thumbnail) => ({
        url: thumbnail?.picture_url,
        id: thumbnail.picture_id,
        file: null,
      })),
    )
    setMultipleFiles(
      templateMultipleThumbnails.map((thumbnail) => ({
        url: thumbnail?.picture_url,
        id: thumbnail?.picture_id,
        file: null,
      })),
    )
    setFinalFiles(templateMultipleThumbnails.map((thumbnail) => thumbnail?.picture_url))
  }, [templateMultipleThumbnails])

  const handleAddFile = (event) => {
    event.preventDefault()

    if (fileArray.length < 9) {
      const fileId = uuidv4() // Generate a unique ID using uuid
      setFileArray([...fileArray, { id: fileId, file: null }])
      setFinalFiles([...finalFiles, ''])

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
      updatedArray[index] = { id, file }
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

      // Replace the empty string with the new URL in the finalFiles array
      setFinalFiles((prevFiles) => {
        const updatedFiles = [...prevFiles]
        updatedFiles[index] = publicUrl
        return updatedFiles
      })

      // You might want to handle other state updates or logic here
    } catch (error) {
      console.error('Error uploading file:', error.message)
      toast.error(`${error.message}`)

      // Handle error as needed
    }
  }

  const [isUploading, setIsUploading] = useState(false)
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
    setIsUploading(true)
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
    } finally {
      setIsUploading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch template data using the provided template ID
      const response = await axiosInstance.get(`admin/template/${id}`)
      const templateData = response?.data?.data

      // Set the form fields with the retrieved data
      setTemplateName(templateData.template_name)
      setTemplateDescription(templateData.template_description)
      setTemplateCode(templateData.template_code)
      setCategoryId(templateData.category_id)
      setTemplateKey(templateData.template_key)
      setTemplateDownloadCount(templateData.template_download_count)
      setTemplateViewCount(templateData.template_view_count)
      setThumbnailUrl(templateData.template_thumbnail) // Set the thumbnail URL
      setTemplateMultipleThumbnails(templateData?.template_multiple_thumbnails)
    } catch (error) {
      console.error('Error fetching template data:', error)
      toast.error('Error fetching template data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleUpdateTemplate = async () => {
    try {
      if (!templateName || !templateDescription || !templateCode || !categoryId) {
        toast.error('Please fill in all fields', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      setLoading(true)
      if (thumbnailUrl === '' && !thumbnail) {
        toast.error('Please select a thumbnail.', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      const hasNullValues = fileArray.some((file) => !file?.url && file?.file === null)

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

      const requestBody = {
        template_name: templateName,
        template_description: templateDescription,
        template_code: templateCode,
        category_id: categoryId,
        template_thumbnail: thumbnailUrl,
        template_multiple_thumbnails: '[]',
      }

      // Update template data using the provided template ID

      if (file) {
        requestBody.template_key = templateKey
        requestBody.template_size = templateSize
        requestBody.template_type = templateType
        requestBody.template_url = templateUrl
      }

      if (finalFiles?.length !== 0) {
        requestBody.template_multiple_thumbnails = JSON.stringify(finalFiles)
      }

      await axiosInstance.put(`admin/template/${id}`, requestBody)

      toast.success('Template updated successfully', { position: toast.POSITION.TOP_RIGHT })
      setEditable(false) // Turn off edit mode after updating
      setEditIconVisible(true) // Show the edit icon again
      navigate('/templates')
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error(error?.response?.data?.message || 'Failed to update template', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } finally {
      setLoading(false)
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
            {/* Display the thumbnail image if thumbnailUrl exists */}
            {thumbnailUrl && !editable && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={thumbnailUrl} alt="Thumbnail" style={{ maxWidth: '300px' }} />
              </div>
            )}
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
              <CFormTextarea
                type="text"
                id="templateDescription"
                placeholder="Enter template description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                disabled={!editable}
                rows={7} // Set the "disabled" attribute based on the "editable" state
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

              {editable && (
                <>
                  <CFormLabel htmlFor="thumbnail">Thumbnail</CFormLabel>
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
                </>
              )}

              {/* Conditionally render the "Choose File" button based on the "editable" state */}
              {editable && (
                <>
                  <CFormLabel htmlFor="file">File</CFormLabel>
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

              {editable && (
                <>
                  {' '}
                  <CFormLabel htmlFor="file">Add More Thumbnails</CFormLabel>
                  <div>
                    {fileArray.map((file, index) => (
                      <div key={file?.id} style={{ display: 'flex', marginBottom: '10px' }}>
                        {file?.url ? (
                          <img
                            src={file?.url}
                            alt="thumbnail"
                            style={{ width: '100px', marginRight: '65.7%' }}
                          />
                        ) : (
                          <CFormInput
                            type="file"
                            onChange={(event) => handleFileChange(file?.id, index, event)}
                            accept="image/*"
                          />
                        )}
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

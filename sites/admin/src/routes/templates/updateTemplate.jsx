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

const UpdateTemplate = () => {
  const { id } = useParams() // Retrieve the template ID from params
  const navigate = useNavigate()

  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [templateKey, setTemplateKey] = useState('')
  const [templateDownloadCount, setTemplateDownloadCount] = useState('')
  const [templateViewCount, setTemplateViewCount] = useState('')

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editable, setEditable] = useState(false) // New state for edit mode
  const [editIconVisible, setEditIconVisible] = useState(true)

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

      // Update template data using the provided template ID
      await axiosInstance.put(`template/${id}`, {
        template_name: templateName,
        template_description: templateDescription,
        template_code: templateCode,
        category_id: categoryId,
      })

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
    setTemplateName('')
    setTemplateDescription('')
    setTemplateCode('')
    setCategoryId('')
    setFile(null)
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
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={!editable} // Set the "disabled" attribute based on the "editable" state
                  />
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

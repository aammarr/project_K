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
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdateTemplate = () => {
  const { id } = useParams() // Retrieve the template ID from params
  const navigate = useNavigate()

  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

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
  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching template data:', error)
        toast.error('Error fetching template data')
      }
    }

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
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>Update Template</CCardHeader>
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
              <CFormInput type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />

              <CButton color="primary" onClick={handleUpdateTemplate} style={{ marginTop: '20px' }}>
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
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UpdateTemplate

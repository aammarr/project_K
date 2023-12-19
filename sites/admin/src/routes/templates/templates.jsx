/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import axiosInstance from 'src/axios/axiosConfig'
import Pagination from '@mui/material/Pagination'

const Templates = () => {
  const navigate = useNavigate()
  const [templates, settemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 25 // Adjust the number of items per page as needed

  const handleButtonClick = () => {
    navigate('add')
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true) // Set loading to true before making the API call
        const response = await axiosInstance.get(
          `template?page=${currentPage}&limit=${itemsPerPage}&search=`,
        )
        settemplates(response?.data?.data)
        setTotalPages(response?.data?.pagination?.totalPages)
        setTotalItems(response?.data?.pagination?.totalResults)
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Error fetching templates')
      } finally {
        setLoading(false) // Set loading to false after the API call is complete
      }
    }

    fetchTemplates()
  }, [currentPage])

  const handleUpdatetemplate = (templateId) => {
    navigate(`update/${templateId}`)
  }

  const handleDeleteTemplate = (templateId) => {
    setSelectedTemplateId(templateId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = async () => {
    try {
      await axiosInstance.delete(`template/${selectedTemplateId}`)
      // After deletion, re-fetch data for the current page
      const response = await axiosInstance.get(
        `template?page=${currentPage}&limit=${itemsPerPage}&search=`,
      )
      settemplates(response?.data?.data)
      setShowDeleteModal(false)
      toast.success('template deleted successfully')
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Error deleting template')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handlePageChange = (event, page) => {
    // Update the current page when the page changes
    console.log(page)
    setCurrentPage(page)
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div> Templates</div>
                <div className="ml-auto">
                  <CButton color="primary" onClick={handleButtonClick}>
                    Add New template
                  </CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" size="lg" />
                </div>
              ) : (
                <>
                  <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Template ID</CTableHeaderCell>
                        <CTableHeaderCell>Template Name</CTableHeaderCell>
                        <CTableHeaderCell>Category Name</CTableHeaderCell>

                        <CTableHeaderCell>Template Description</CTableHeaderCell>
                        <CTableHeaderCell>Template Code</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {templates.map((template) => (
                        <CTableRow key={template.template_id}>
                          <CTableDataCell>{template.template_id}</CTableDataCell>
                          <CTableDataCell>{template.template_name}</CTableDataCell>
                          <CTableDataCell>{template.category_name}</CTableDataCell>

                          <CTableDataCell>{template.template_description}</CTableDataCell>
                          <CTableDataCell>{template.template_code}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              onClick={() => handleUpdatetemplate(template.template_id)}
                            >
                              Update
                            </CButton>{' '}
                            <CButton
                              color="danger"
                              onClick={() => handleDeleteTemplate(template.template_id)}
                            >
                              Delete
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <br />
                  <span>Total Results: {totalItems}</span>
                </>
              )}
              <br />

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination count={totalPages} color="primary" onChange={handlePageChange} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        alignment="center"
      >
        <CModalHeader closeButton>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this template?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={handleDeleteConfirmation}>
            Yes
          </CButton>{' '}
          <CButton color="secondary" onClick={handleCancelDelete}>
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Templates

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
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
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilSearch, cilTrash } from '@coreui/icons'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const Templates = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [limit, setLimit] = useState(25)
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [modalImage, setModalImage] = useState('')

  const openModal = (imageURL) => {
    setModalImage(imageURL)

    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalImage('')
  }

  const handleButtonClick = () => {
    navigate('/add-template')
  }

  const handleDownloadTemplate = async (key) => {
    console.log(key)
    const responseOne = await axiosInstance.get(
      `template/getSignedUrlDownload?type=get&name=${key}`,
    )
    window.open(responseOne?.data?.data, '_blank')
    fetchTemplates()
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        `admin/templates?page=${currentPage}&limit=${limit}&search=${searchText ? searchText : ''}`,
      )
      setTemplates(response?.data?.data)
      setTotalPages(response?.data?.pagination?.totalPages)
      setTotalItems(response?.data?.pagination?.totalResults)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Error fetching templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [currentPage, limit])

  const handleUpdateTemplate = (templateId) => {
    navigate('/edit-template', { state: { templateId } })
  }

  const handleDeleteTemplate = (templateId) => {
    setSelectedTemplateId(templateId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = async () => {
    try {
      await axiosInstance.delete(`template/${selectedTemplateId}`)
      const response = await axiosInstance.get(
        `admin/templates?page=${currentPage}&limit=${limit}&search=${searchText ? searchText : ''}`,
      )
      setTemplates(response?.data?.data)
      setShowDeleteModal(false)
      toast.success('Template deleted successfully')
      setCurrentPage(1)
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Error deleting template')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    if (currentPage === 1) fetchTemplates()
  }

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1)
      if (currentPage === 1) fetchTemplates()
    }
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
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ marginRight: '40px' }}>Templates</div>
                  <div>
                    <CInputGroup>
                      <CFormInput
                        placeholder="Search Templates"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        value={searchText}
                      />
                      <CButton
                        type="button"
                        color="secondary"
                        variant="outline"
                        id="button-addon2"
                        onClick={handleSearch}
                      >
                        <CIcon icon={cilSearch} size="sm" />
                      </CButton>
                    </CInputGroup>
                  </div>
                </div>
                <div className="ml-auto">
                  <CButton color="primary" onClick={handleButtonClick}>
                    Add New Template
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
                        <CTableHeaderCell>Thumbnail</CTableHeaderCell>

                        <CTableHeaderCell>Template Name</CTableHeaderCell>
                        <CTableHeaderCell>Template Code</CTableHeaderCell>
                        <CTableHeaderCell>Category Name</CTableHeaderCell>
                        <CTableHeaderCell>Views</CTableHeaderCell>
                        <CTableHeaderCell>Downloads</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {templates.map((template) => (
                        <CTableRow key={template.template_id}>
                          <CTableDataCell>{template.template_id}</CTableDataCell>
                          <CTableDataCell>
                            {template?.template_thumbnail ? (
                              <div>
                                <img
                                  src={template?.template_thumbnail}
                                  alt="thumbnail"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openModal(template?.template_thumbnail)}
                                  width="50px"
                                />
                              </div>
                            ) : (
                              'No thumbnail'
                            )}

                            {/* Modal */}
                            <CModal visible={modalVisible} onClose={closeModal}>
                              <CModalHeader closeButton>
                                <CModalTitle>Image Preview</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                {/* Image inside modal */}
                                <img src={modalImage} alt="thumbnail" style={{ width: '100%' }} />
                              </CModalBody>
                            </CModal>
                          </CTableDataCell>
                          <CTableDataCell>{template.template_name}</CTableDataCell>
                          <CTableDataCell>{template.template_code}</CTableDataCell>
                          <CTableDataCell>{template.category_name}</CTableDataCell>
                          <CTableDataCell>{template.template_view_count}</CTableDataCell>
                          <CTableDataCell>{template.template_download_count}</CTableDataCell>
                          <CTableDataCell>
                            {template?.template_key && (
                              <CloudDownloadIcon
                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                onClick={() => handleDownloadTemplate(template.template_key)}
                              />
                            )}
                            <VisibilityIcon
                              style={{ marginRight: '10px', cursor: 'pointer' }}
                              onClick={() => handleUpdateTemplate(template.template_id)}
                            />
                            <DeleteOutlineIcon
                              style={{ marginRight: '10px', cursor: 'pointer' }}
                              onClick={() => handleDeleteTemplate(template.template_id)}
                            />
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
                <Pagination
                  count={totalPages}
                  color="primary"
                  onChange={handlePageChange}
                  page={currentPage}
                />
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

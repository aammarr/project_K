/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
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
import { cilSearch } from '@coreui/icons'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [limit, setLimit] = useState(25)

  const handleButtonClick = () => {
    navigate('/add-category')
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        `category?page=${currentPage}&limit=${limit}&search=${searchText ? searchText : ''}`,
      )
      setCategories(response?.data?.data)
      setTotalPages(response?.data?.pagination?.totalPages)
      setTotalItems(response?.data?.pagination?.totalResults)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Error fetching categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    console.log('use effect triggered')
    console.log(currentPage)
  }, [currentPage, limit])

  const handleUpdateCategory = (categoryId) => {
    navigate('/edit-category', { state: { categoryId } })
  }

  const handleDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = async () => {
    try {
      await axiosInstance.delete(`category/${selectedCategoryId}`)
      const response = await axiosInstance.get(
        `category?page=${currentPage}&limit=10&search=${searchText}`,
      )
      setCategories(response?.data?.data)
      setShowDeleteModal(false)
      toast.success('Category deleted successfully')
      setCurrentPage(1)
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const handleSearch = async () => {
    setCurrentPage(1)
    if (currentPage === 1) {
      fetchCategories()
    }
  }

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1)
      if (currentPage === 1) {
        fetchCategories()
      }
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
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginRight: '40px' }}>Categories</div>
                  <div>
                    <CInputGroup>
                      <CFormInput
                        placeholder="Search Categories"
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
                    Add New Category
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
                        <CTableHeaderCell>Category ID</CTableHeaderCell>
                        <CTableHeaderCell>Category Name</CTableHeaderCell>
                        <CTableHeaderCell>Category Description</CTableHeaderCell>
                        <CTableHeaderCell>Category Code</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {categories.map((category) => (
                        <CTableRow key={category.category_id}>
                          <CTableDataCell>{category.category_id}</CTableDataCell>
                          <CTableDataCell>{category.category_name}</CTableDataCell>
                          <CTableDataCell>{category.category_description}</CTableDataCell>
                          <CTableDataCell>{category.category_code}</CTableDataCell>
                          <CTableDataCell>
                            <ModeEditIcon
                              style={{ marginRight: '10px', cursor: 'pointer' }}
                              onClick={() => handleUpdateCategory(category.category_id)}
                            />
                            <DeleteOutlineIcon
                              style={{ marginRight: '10px', cursor: 'pointer' }}
                              onClick={() => handleDeleteCategory(category.category_id)}
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
        <CModalBody>Are you sure you want to delete this category?</CModalBody>
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

export default Categories

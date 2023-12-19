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

const Categories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
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
    const fetchCategories = async () => {
      try {
        setLoading(true) // Set loading to true before making the API call
        const response = await axiosInstance.get(
          `category?page=${currentPage}&limit=${itemsPerPage}&search=`,
        )
        setCategories(response?.data?.data)
        setTotalPages(response?.data?.pagination?.totalPages)
        setTotalItems(response?.data?.pagination?.totalResults)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Error fetching categories')
      } finally {
        setLoading(false) // Set loading to false after the API call is complete
      }
    }

    fetchCategories()
  }, [currentPage])

  const handleUpdateCategory = (categoryId) => {
    navigate(`update/${categoryId}`)
  }

  const handleDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = async () => {
    try {
      await axiosInstance.delete(`category/${selectedCategoryId}`)
      // After deletion, re-fetch data for the current page
      const response = await axiosInstance.get(
        `category?page=${currentPage}&limit=${itemsPerPage}&search=`,
      )
      setCategories(response?.data?.data)
      setShowDeleteModal(false)
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category')
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
                <div> Categories</div>
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
                            <CButton
                              color="info"
                              onClick={() => handleUpdateCategory(category.category_id)}
                            >
                              Update
                            </CButton>{' '}
                            <CButton
                              color="danger"
                              onClick={() => handleDeleteCategory(category.category_id)}
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

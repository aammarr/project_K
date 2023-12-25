/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { cilSearch } from '@coreui/icons' // Import search icon
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ModeEditIcon from '@mui/icons-material/ModeEdit'

const Categories = () => {
  const { page, limit, search } = useParams()

  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(parseInt(page))
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 25 // Adjust the number of items per page as needed

  const [searchText, setSearchText] = useState(search)

  console.log(page, limit, search)
  const handleButtonClick = () => {
    navigate('/categories/add')
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true) // Set loading to true before making the API call
        const response = await axiosInstance.get(
          `category?page=${page}&limit=${limit}&search=${search ? search : ''}`,
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
  }, [page, limit, search])

  const handleUpdateCategory = (categoryId) => {
    navigate(`/categories/update/${categoryId}`)
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
        `category?page=${page}&limit=${limit}&search=${searchText ? searchText : ''}`,
      )
      setCategories(response?.data?.data)
      setShowDeleteModal(false)
      toast.success('Category deleted successfully')
      setCurrentPage(1)

      navigate(`/categories/1/${limit}/${searchText ? searchText : ''}`)
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
    navigate(`/categories/${page}/${limit}/${searchText ? searchText : ''}`)
  }

  const handleSearch = () => {
    // Your search logic here
    console.log('Search:', searchText)
    window.location = `/categories/1/${limit}/${searchText}`
  }

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleKeyPress = (event) => {
    // Check if the pressed key is the "Enter" key (key code 13)
    if (event.key === 'Enter') {
      handleSearch()
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
                  defaultPage={currentPage}
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

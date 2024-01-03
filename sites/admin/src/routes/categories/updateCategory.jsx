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
  CRow,
  CSpinner,
} from '@coreui/react'
import axiosInstance from '../../axios/axiosConfig'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdateCategory = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const id = location.state?.categoryId

  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`category/${id}`)
        const categoryDetails = response.data.data

        setCategoryName(categoryDetails.category_name)
        setCategoryDescription(categoryDetails.category_description)
        setCategoryCode(categoryDetails.category_code)
      } catch (error) {
        console.error('Error fetching category details:', error)
        toast.error(error?.response?.data?.message || 'Failed to fetch category details', {
          position: toast.POSITION.TOP_RIGHT,
        })
        if (error?.response?.data?.message === 'Category not found') navigate('/categories')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCategoryDetails()
    }
  }, [id])

  const handleUpdateCategory = async () => {
    try {
      if (!categoryName || !categoryDescription || !categoryCode) {
        toast.error('Please fill in all fields', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      setLoading(true)

      const response = await axiosInstance.put(`category/${id}`, {
        category_name: categoryName,
        category_description: categoryDescription,
        category_code: categoryCode,
      })

      toast.success('Category updated successfully', { position: toast.POSITION.TOP_RIGHT })
      navigate('/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error?.response?.data?.message || 'Failed to update category', {
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
          <CCardHeader>Update Category</CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel htmlFor="categoryName">Category Name</CFormLabel>
              <CFormInput
                type="text"
                id="categoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <CFormLabel htmlFor="categoryDescription">Category Description</CFormLabel>
              <CFormInput
                type="text"
                id="categoryDescription"
                placeholder="Enter category description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
              <CFormLabel htmlFor="categoryCode">Category Code</CFormLabel>
              <CFormInput
                type="text"
                id="categoryCode"
                placeholder="Enter category code"
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
              />
              <CButton
                color="primary"
                onClick={handleUpdateCategory}
                style={{ marginTop: '20px' }}
                disabled={loading}
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
                  'Update Category'
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UpdateCategory

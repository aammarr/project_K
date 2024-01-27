/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddCategory = () => {
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddCategory = async () => {
    try {
      if (!categoryName || !categoryDescription || !categoryCode) {
        toast.error('Please fill in all fields', { position: toast.POSITION.TOP_RIGHT })
        return
      }

      setLoading(true)

      const response = await axiosInstance.post('admin/category', {
        category_name: categoryName,
        category_description: categoryDescription,
        category_code: categoryCode,
      })

      toast.success('Category added successfully', { position: toast.POSITION.TOP_RIGHT })
      navigate('/categories')
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error(error?.response?.data?.message || 'Failed to add category', {
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
          <CCardHeader>Add Category</CCardHeader>
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
                onClick={handleAddCategory}
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
                    <span style={{ marginLeft: '5px' }}> Adding... </span>
                  </>
                ) : (
                  'Add Category'
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddCategory

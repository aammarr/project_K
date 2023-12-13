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
} from '@coreui/react'

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryCode, setCategoryCode] = useState('')

  const handleAddCategory = () => {
    // Implement the logic to add the category here
    console.log('Adding category:', {
      categoryName,
      categoryDescription,
      categoryCode,
    })
    // You can add the logic to send the data to your API or perform other actions.
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>Add Category</CCardHeader>
          <CCardBody>
            <CForm>
              {' '}
              {/* Change this line */}
              <CFormLabel htmlFor="categoryName">Category Name</CFormLabel>
              <CFormInput
                type="text"
                id="categoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />{' '}
              {/* Change this line */}
              <CFormLabel htmlFor="categoryDescription">Category Description</CFormLabel>
              <CFormInput
                type="text"
                id="categoryDescription"
                placeholder="Enter category description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />{' '}
              {/* Change this line */}
              <CFormLabel htmlFor="categoryCode">Category Code</CFormLabel>
              <CFormInput
                type="text"
                id="categoryCode"
                placeholder="Enter category code"
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
              />
              <CButton color="primary" onClick={handleAddCategory} style={{ marginTop: '20px' }}>
                Add Category
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddCategory

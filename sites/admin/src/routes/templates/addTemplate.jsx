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
  CFormSelect, // Add this line for the dropdown
  CRow,
  CInputFile, // Add this line for the file input
} from '@coreui/react'

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [categoryId, setCategoryId] = useState('') // State for category dropdown
  const [file, setFile] = useState(null) // State for file input

  const handleAddTemplate = () => {
    // Implement the logic to add the template here
    console.log('Adding template:', {
      templateName,
      templateDescription,
      templateCode,
      categoryId,
      file,
    })
    // You can add the logic to send the data to your API or perform other actions.
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>Add template</CCardHeader>
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
                {/* Add options dynamically based on your category data */}
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                {/* Add more options as needed */}
              </CFormSelect>
              <CFormLabel htmlFor="file">Upload File</CFormLabel>
              <CFormInput type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
              <CButton color="primary" onClick={handleAddTemplate} style={{ marginTop: '20px' }}>
                Add Template
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddTemplate

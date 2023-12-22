/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CProgress,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPeople } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from 'src/axios/axiosConfig'
import Pagination from '@mui/material/Pagination'
import avatar9 from './../assets/images/avatars/8.jpg'

const Users = () => {
  const { page, limit, search } = useParams()

  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(parseInt(page))
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const [searchText, setSearchText] = useState(search)

  // const handleButtonClick = () => {
  //   navigate('/users/add')
  // }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(
          `user/?page=${page}&limit=${limit}&search=${search ? search : ''}`,
        )
        setUsers(response?.data?.data)
        setTotalPages(response?.data?.pagination?.totalPages)
        setTotalItems(response?.data?.pagination?.totalResults)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Error fetching users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, limit, search])

  const handlePageChange = (event, page) => {
    navigate(`/users/${page}/${limit}/${searchText ? searchText : ''}`)
  }

  const handleSearch = () => {
    window.location = `/users/1/${limit}/${searchText}`
  }

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleKeyPress = (event) => {
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
                  <div style={{ marginRight: '40px' }}>Users</div>
                  <div>
                    <CInputGroup>
                      <CFormInput
                        placeholder="Search Users"
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
                  {/* <CButton color="primary" onClick={handleButtonClick}>
                    Add New User
                  </CButton> */}
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
                        {/* Table headers remain the same as in Categories page */}
                        <CTableHeaderCell className="text-center">
                          <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell>User</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Phone</CTableHeaderCell>
                        <CTableHeaderCell>City</CTableHeaderCell>

                        <CTableHeaderCell>Country</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users.map((user) => (
                        <CTableRow key={user.user_id}>
                          <CTableDataCell className="text-center">
                            {user?.avatar ? (
                              <CAvatar size="md" src={user.avatar} />
                            ) : (
                              <CAvatar size="md" src={avatar9} />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{`${user.first_name} ${user.last_name}`}</div>
                            <div className="small text-medium-emphasis">
                              {/* <span>{user.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '} */}
                              {/* {user.user.registered} */}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>{' '}
                          <CTableDataCell>{user.phone}</CTableDataCell>
                          <CTableDataCell>
                            {/* <CIcon size="xl" icon={user.country} title={user.country} /> */}
                            {user.city}
                          </CTableDataCell>
                          <CTableDataCell>
                            {/* <CIcon size="xl" icon={user.country} title={user.country} /> */}
                            {user.country}
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
    </>
  )
}

export default Users

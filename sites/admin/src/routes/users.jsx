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
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPeople } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from 'src/axios/axiosConfig'
import Pagination from '@mui/material/Pagination'
import avatar9 from './../assets/images/avatars/8.jpg'

const Users = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [limit, setLimit] = useState(25)

  const [searchText, setSearchText] = useState('')

  // const handleButtonClick = () => {
  //   navigate('/users/add')
  // }
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        `admin/users/?page=${currentPage}&limit=${limit}&search=${searchText ? searchText : ''}`,
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

  useEffect(() => {
    fetchUsers()
  }, [currentPage, limit])

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const handleSearch = () => {
    setCurrentPage(1)

    if (currentPage === 1) {
      fetchUsers()
    }
  }

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1)
      if (currentPage === 1) {
        fetchUsers()
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
                        <CTableHeaderCell>Subscription</CTableHeaderCell>
                        <CTableHeaderCell>Expiry Date</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users?.length !== 0 &&
                        users.map((user) => (
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
                              <CBadge color={user?.subscribed === '1' ? 'success' : 'danger'}>
                                {user?.subscribed === '1' ? 'Subscribed' : 'Unsubscribed'}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* <CIcon size="xl" icon={user.country} title={user.country} /> */}
                              {user?.subscription_expire ? user.subscription_expire : 'N/A'}
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
    </>
  )
}

export default Users

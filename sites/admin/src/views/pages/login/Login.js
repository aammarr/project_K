import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if x-auth-token exists in local storage
    const authToken = localStorage.getItem('x-auth-token')
    if (authToken) {
      // Redirect to dashboard if token exists
      navigate('/dashboard')
    }
  }, [])

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error('Please enter both email and password', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      setLoading(true)
      // Make sure to replace 'YOUR_API_ENDPOINT' with the actual endpoint
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}admin/login`, {
        email,
        password,
      })

      const userData = response.data.data
      console.log(userData)

      // Save data to local storage
      localStorage.setItem('user_id', userData.user_id)
      localStorage.setItem('email', userData.email)
      localStorage.setItem('role_id', userData.role_id)
      localStorage.setItem('name', `${userData.first_name} ${userData.last_name}`)
      localStorage.setItem('x-auth-token', userData.token)

      // Display toast for successful login
      if (userData?.token) {
        toast.success('Login successful', { position: toast.POSITION.TOP_RIGHT })

        navigate('/dashboard')
      }
    } catch (error) {
      // Handle login failure
      console.error('Login failed', error)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent the default form submission
    await handleLogin() // Call your handleLogin function
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? (
                            <>
                              <CSpinner
                                as="span"
                                size="sm"
                                animation="border"
                                role="status"
                                aria-hidden="true"
                              />
                              <span style={{ marginLeft: '5px' }}> Login </span>
                            </>
                          ) : (
                            'Login'
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center"></CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

import React, { Component, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import PropTypes from 'prop-types'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('x-auth-token') !== null

  return isAuthenticated ? element : <Navigate to="/login" />
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route index element={<Login />} />
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route
              path="*"
              name="Home"
              element={<PrivateRoute element={<DefaultLayout />} />}
            />{' '}
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App

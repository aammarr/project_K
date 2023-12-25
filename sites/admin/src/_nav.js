import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBook,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilListRich,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/categories',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Templates',
    to: '/templates',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
]

export default _nav

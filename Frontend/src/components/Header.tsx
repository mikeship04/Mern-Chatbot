import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Logo from './shared/Logo'

function Header() {
  return (
    <AppBar sx={{bgcolor: "transparent", position: "static", boxShadow: "none"}}>
      <Toolbar sx={{display: "flex"}}>
        <Logo/>
      </Toolbar>
    </AppBar>
  )
}

export default Header
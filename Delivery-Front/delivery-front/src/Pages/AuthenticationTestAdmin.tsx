import React from 'react'
import { withAdminAuth } from '../HOC'

function AuthenticationTestAdmin() {
  return (
    <div>
      Ovoj stranici moze pristupiti samo ADMIN!
    </div>
  )
}

export default withAdminAuth(AuthenticationTestAdmin);

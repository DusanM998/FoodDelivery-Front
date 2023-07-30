import React from 'react'
import { withAuth } from '../HOC';

function AuthenticationTest() {
  return (
    <div>
      Ovoj stranici moze pristupiti bilo koji ulogovan korisnik!
    </div>
  )
}

export default withAuth(AuthenticationTest);

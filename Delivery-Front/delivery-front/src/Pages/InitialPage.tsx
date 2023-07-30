import { url } from 'inspector';
import React from 'react';
import { NavLink } from 'react-router-dom';
let background = require("../Assets/Images/background.jpg");

function InitialPage() {
  return (
    <div className='glavniDiv' style={{backgroundImage: `url(${background})`}}>
      <div className='container'>
          <div className='row'>
            <div className='col-8'>
              
            </div>
          <div className='col-4'>
            <h1>Istražite ponudu hrane</h1>
            <div>
              <NavLink className="nav-link p-3" aria-current="page" to="/menuPage">
                <button style={{backgroundColor:"#8d3d5b", color:"white"}} className='m-1 btn btn-lg'>Istraži</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitialPage

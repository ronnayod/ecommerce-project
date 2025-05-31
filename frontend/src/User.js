import React from 'react'
// import axios from 'axios';
import { Link } from 'react-router-dom';

function User() {
  return (
    <>
      <div className="text-center mt-4">
          <Link to="/">
            <button className="btn btn-primary">กลับหน้าหลัก</button>
          </Link>
      </div>
    </>
  )
}

export default User

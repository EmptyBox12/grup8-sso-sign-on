import React from 'react'

export default function navBar({setCreateMode}) {
  return (
    <div className='header'>
       <span className='title'>User Manager</span>
      <button onClick={()=> {setCreateMode(true)}} className='createUser'>Create User</button>
    </div>
  )
}

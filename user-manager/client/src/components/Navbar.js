import React from 'react'

export default function navBar({setCreateMode, setUpdateMode}) {
  function homepage() {
    setCreateMode(false);
    setUpdateMode({show:false, id:0});
  }
  return (
    <div className='header'>
       <span className='title' onClick={homepage}>User Manager</span>
      <button onClick={()=> {setCreateMode(true)}} className='createUser'>Create User</button>
    </div>
  )
}

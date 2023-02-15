import React from 'react'
import './Navbar.css'

function Navbar ({ tabsArray, windowsArray, title, url }) {
  const tabLength = tabsArray.length
  const windowLength = windowsArray.length

  return (
    <nav>
      {title !== '' ? (
        <>
          <div>
            <p> {title}</p>
            <p> {url}</p>
          </div>
        </>
      ) : (
        <p>
          {tabLength} tabs in {windowLength} windows
        </p>
      )}
    </nav>
  )
}

export default Navbar

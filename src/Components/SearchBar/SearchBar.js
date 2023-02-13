import React, { useState } from 'react'
import Addwindow from '../Fonts/addwindow'
import Bin from '../Fonts/bin'
import Pin from '../Fonts/pin'
import './SearchBar.css'

function SearchBar ({
  searchValue,
  pinAtab,
  onHoverTitle,
  addWindow,
  closeTabs,
  tabsToDeleteId,
  deleteSelectedTab
}) {
  const [searchBar, setSearchBar] = useState('')

  return (
    <>
      <div className='search-bar-container'>
        <div>
          <input
            type='text'
            name=''
            id=''
            placeholder='Search for a tab..'
            onChange={e => {
              setSearchBar(e.target.value)
              searchValue(e.target.value)
            }}
            value={searchBar}
          />
        </div>
        <div className='search-bar-action'>
          <Addwindow addWindow={addWindow} onHoverTitle={onHoverTitle} />
          <Pin pinAtab={pinAtab} onHoverTitle={onHoverTitle} />
          <Bin
            onHoverTitle={onHoverTitle}
            closeTabs={closeTabs}
            tabsToDeleteId={tabsToDeleteId}
            deleteSelectedTab={deleteSelectedTab}
          />
        </div>
      </div>
    </>
  )
}

export default SearchBar

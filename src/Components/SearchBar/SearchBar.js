import React, { useState } from 'react'
import Addwindow from '../Fonts/addwindow'
import Bin from '../Fonts/bin'
import Contact from '../Fonts/contact'
import Github from '../Fonts/github'
import Info from '../Fonts/info'
import Pin from '../Fonts/pin'

import './SearchBar.css'
function SearchBar ({
  searchValue,
  pinAtab,
  onHoverTitle,
  addWindow,
  closeTabs,
  tabsToDeleteId,
  deleteSelectedTab,
  tabsArray,
  switchToTab,
  setShowSearchSuggestion,
  showSearchSuggestion,
  windowsArray
}) {
  const [searchBar, setSearchBar] = useState('')

  return (
    <>
      <div
        className='search-bar-container'
        onContextMenu={e => e.preventDefault()}
      >
        <div>
          <input
            type='text'
            name=''
            id=''
            onClick={() => setShowSearchSuggestion(true)}
            placeholder='Search for a keyword or tab..'
            onChange={e => {
              setSearchBar(e.target.value)
              searchValue(e.target.value)
            }}
            value={searchBar}
          />{' '}
          {searchBar !== '' && (
            <>
              {showSearchSuggestion && (
                <div className='dropdown-search-container'>
                  <>
                    {tabsArray &&
                      tabsArray
                        .filter(tab => {
                          const searchTerm = searchBar.toLowerCase()
                          const title = tab.title.toLowerCase()
                          const url = tab.url.toLowerCase()

                          return (
                            searchTerm !== '' &&
                            (title.includes(searchTerm) ||
                              url.includes(searchBar)) &&
                            (url !== searchBar || title !== searchBar)
                          )
                        })
                        .map(item => {
                          return (
                            <div
                              className={`search-container ${
                                (item.active || item.audible) && 'audible'
                              }`}
                              onClick={() => {
                                switchToTab(item.id)
                              }}
                            >
                              <div className='search-image-container'>
                                <img src={item.favIconUrl} alt='' />
                              </div>
                              <div className='search-title-container'>
                                <p>{item.title}</p>
                                <p>{item.url}</p>
                              </div>
                            </div>
                          )
                        })}
                  </>
                </div>
              )}
            </>
          )}
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
          <Info onHoverTitle={onHoverTitle} />
          <Github onHoverTitle={onHoverTitle} />
          <Contact onHoverTitle={onHoverTitle} />
        </div>
      </div>
    </>
  )
}

export default SearchBar

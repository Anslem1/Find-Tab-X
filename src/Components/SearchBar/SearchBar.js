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
  deleteSelectedTab,
  tabsArray,
  switchToTab
}) {
  const [searchBar, setSearchBar] = useState('')

  console.log(tabsArray)

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
          />{' '}
          {searchBar !== '' && (
            <div
              className='dropdown-search-container
'
            >
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
                        <div>
                          <div>
                            <div
                              className='search-container'
                              onClick={() => switchToTab(item.id)}
                            >
                              <div className='search-image-container'>
                                <img src={item.favIconUrl} alt='' />
                              </div>
                              <div className='search-title-container'>
                                <p>{item.title}</p>
                                <p>{item.url}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </>
            </div>
          )}
        </div>
        <div className='search-bar-action'>
          <Addwindow addWindow={addWindow} onHoverTitle={onHoverTitle} />
          <Pin pinAtab={pinAtab} onHoverTitle={onHoverTitle} />
          <Bin
            onHorTitle={onHoverTitle}
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

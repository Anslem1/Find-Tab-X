import React, { useEffect, useRef, useState } from 'react'
import Addtab from '../Fonts/addtab'
import Maximize from '../Fonts/maximize'
import Xmark from '../Fonts/x-mark'

/*global chrome*/

function ClosedWindows ({
  window,

  removeWindow,
  switchToTab,
  switchToWindow,
  search,
  onHoverTitle,
  onHoverUrl,
  maximizeWindow,
  createTabFromWindow,
  setWindowsArray
}) {
  // const [rowCount, setRowCount] = useState(0)
  const [columnCount, setColumnCount] = useState(0)
  const parentRef = useRef(null)

  const [rightClicks, setRightClicks] = useState(0)

  const [tabId, setTabId] = useState('')
  const [selectedTabId, setSelectedTabId] = useState('')

  useEffect(() => {
    const totalLength = window.tabs.length
    const squareRoot = Math.sqrt(totalLength)
    setColumnCount(Math.round(squareRoot) + 1)
  }, [window.tabs.length])

  const handleRightClick = e => {
    e.preventDefault()
    if (e.button === 2) setRightClicks(rightClicks + 1)
  }

  useEffect(() => {
    if (rightClicks === 2) {
      if (tabId !== '' && selectedTabId !== '' && tabId === selectedTabId) {
        chrome.tabs.remove(tabId, () => {
          chrome.windows.getAll(
            {
              populate: true
            },
            function (windows) {
              setWindowsArray(windows)
              setRightClicks(0)
            }
          )
        })
      } else {
        setRightClicks(0)
        setSelectedTabId('')
        setTabId('')
        return
      }
    }
  }, [rightClicks, selectedTabId, setWindowsArray, tabId])

  return (
    <>
      <div
        className={`body-container ${
          window.state === 'normal' && 'window-active'
        }`}
        onClick={() => switchToWindow(window.id)}
      >
        <div
          className={`tab-body-container`}
          ref={parentRef}
          style={{
            gridTemplateColumns: `${`repeat(${columnCount}, 1fr)`}`
          }}
        >
          {window.tabs &&
            window.tabs.map((tab, index) => {
              return (
                <>
                  <div
                    className={`tab-container ${
                      window.state === 'normal' && tab.active && 'tab-active'
                    } ${tab.audible && 'audible'}`}
                    onClick={() => switchToTab(tab.id)}
                    title={tab.title}
                  >
                    <div
                      onMouseOver={() => {
                        onHoverTitle(tab.title)
                        onHoverUrl(tab.url)
                      }}
                      onMouseLeave={() => {
                        onHoverTitle('')
                        onHoverUrl('')
                      }}
                      className={`${tab.audible && 'audible'} ${
                        search !== '' &&
                        (tab.url.toLowerCase().includes(search.toLowerCase()) ||
                          tab.title
                            .toLowerCase()
                            .includes(search.toLowerCase()))
                          ? 'url-search'
                          : search !== '' && 'not-url-search'
                      }`}
                      onContextMenu={e => {
                        handleRightClick(e)
                        rightClicks === 0 &&
                          setSelectedTabId(tab.id, 'selected id from context')
                        rightClicks === 1 &&
                          tab.id === selectedTabId &&
                          setTabId(selectedTabId)
                      }}
                    >
                      <img
                        src={tab.favIconUrl}
                        alt=''
                        className={`${tab.status === 'unloaded' && 'status'} `}
                      />
                    </div>
                  </div>
                </>
              )
            })}
        </div>
        <div className='font-container'>
          <div>
            <Addtab
              createTabFromWindow={() => createTabFromWindow(window.id)}
              onHoverTitle={onHoverTitle}
            />
            <Maximize
              maximizeWindow={() => maximizeWindow(window.id)}
              onHoverTitle={onHoverTitle}
            />
            <Xmark
              removeWindow={() => removeWindow(window.id)}
              onHoverTitle={onHoverTitle}
              window={window}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ClosedWindows

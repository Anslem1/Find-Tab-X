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
  setWindowsArray,
  tabsToDeleteId
}) {
  const [columnCount, setColumnCount] = useState(0)
  const parentRef = useRef(null)

  const [rightClickCount, setRightClickCount] = useState(0)

  const [tabId, setTabId] = useState('')
  const [selectedTabId, setSelectedTabId] = useState('')

  useEffect(() => {
    const totalLength = window.tabs.length
    const squareRoot = Math.sqrt(totalLength)
    setColumnCount(Math.round(squareRoot) + 1)
  }, [window.tabs.length])

  function handleRightClick (e) {
    e.preventDefault()
    setRightClickCount(rightClickCount + 1)
    if (rightClickCount >= 2) {
      setRightClickCount(0)
      setTabId('')
    }
  }

  useEffect(() => {
    if (rightClickCount === 1) {
      setTimeout(() => {
        setRightClickCount(0)
        setTabId('')
      }, 800)
    }
    if (rightClickCount === 2) {
      if (tabId !== '' && selectedTabId !== '' && tabId === selectedTabId) {
        chrome.tabs.remove(tabId, () => {
          chrome.windows.getAll(
            {
              populate: true
            },
            function (windows) {
              setWindowsArray(windows)
              setRightClickCount(0)
            }
          )
        })
      } else {
        setRightClickCount(0)
        setSelectedTabId('')
        setTabId('')
        return
      }
    }
  }, [rightClickCount, selectedTabId, setWindowsArray, tabId])

  function deleteTabs (tabid) {
    if (rightClickCount === 0 && selectedTabId !== tabid && !tabId) {
      if (tabid) {
        const isTabIdInArray = tabsToDeleteId.includes(tabid)
        if (!isTabIdInArray) {
          tabsToDeleteId.push(tabid)
        } else if (isTabIdInArray) {
          const removeFromArray = tabsToDeleteId.indexOf(tabid)
          if (removeFromArray > -1) {
            tabsToDeleteId.splice(removeFromArray, 1)
          }
        }
      }
    }
  }

  return (
    <>
      <div
        className={`body-container ${
          window.state === 'normal' && 'window-active'
        }`}
        onClick={() => switchToWindow(window.id)}
        onContextMenu={e => e.preventDefault()}
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
                  {console.log({ tab })}
                  <div
                    className={`tab-container ${tab.active && 'tab-active'} ${
                      tab.audible && 'audible'
                    }`}
                    title={tab.title}
                    key={index}
                    onClick={() => switchToTab(tab.id)}
                    //IF USER HOVERS OVER ANOTHER TAB, TURNS SET.RIGHT.CLICK TO 0

                    onMouseOver={() => {
                      if (tab.id !== selectedTabId) {
                        setRightClickCount(0)
                      }
                    }}
                    onContextMenu={e => {
                      handleRightClick(e)
                      rightClickCount === 0 &&
                        selectedTabId !== tab.id &&
                        deleteTabs(tab.id)

                      rightClickCount === 0 && setSelectedTabId(tab.id)
                      rightClickCount === 1 &&
                        tab.id === selectedTabId &&
                        setTabId(selectedTabId)
                    }}
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
                      } ${tabsToDeleteId.includes(tab.id) && 'url-search'}`}
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

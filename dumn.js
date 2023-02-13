import React, { useEffect, useRef, useState } from 'react'
import Addtab from '../Fonts/addtab'
import Minimize from '../Fonts/minimize'
import Xmark from '../Fonts/x-mark'
/* eslint-disable react-hooks/exhaustive-deps */
/*global chrome*/
import './OpenedWIndows.css'

function OpenedWindows ({
  window,
  minimizeWindow,
  removeWindow,

  switchToTab,
  switchToWindow,
  search,
  onHoverTitle,
  onHoverUrl,
  createTabFromWindow,
  setWindowsArray,
  pinAtab
}) {
  const [columnCount, setColumnCount] = useState(0)
  const parentRef = useRef(null)
  const [tabId, setTabId] = useState('')
  const [selectedTabId, setSelectedTabId] = useState('')
  const [rightClicks, setRightClicks] = useState(0)
  const [isSelectedTabId, setisSelectedTabId] = useState(false)

  const handleRightClick = e => {
    e.preventDefault()
    setRightClicks(rightClicks + 1)
    if (rightClicks >= 2) {
      setRightClicks(0)
      setSelectedTabId('')
      setTabId('')
    }
  }

  console.log(rightClicks)

  //Listens for double right click to delete a tab
  useEffect(() => {
    switch (rightClicks) {
      case 1:
        console.log('HAHA, YEAH BOYY')
        setisSelectedTabId(true)
        setTimeout(() => {
          setRightClicks(0)
        }, 1200)
        break
      case 2:
        isSelectedTabId(false)
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
        }
        break
      default:
        break
    }
  }, [rightClicks])

  console.log(selectedTabId, 'selected tabid')
  console.log(tabId, 'from outside')

  // Have more columns than rows
  useEffect(() => {
    const totalLength = window.tabs.length
    const squareRoot = Math.sqrt(totalLength)
    setColumnCount(Math.round(squareRoot) + 1)
  }, [window.tabs.length])

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
                    onClick={() => {
                      switchToTab(tab.id)
                    }}
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
                      onContextMenu={e => {
                        handleRightClick(e)
                        console.log(tab.id)
                        isSelectedTabId && setSelectedTabId(tab.id)
                        tab.id === selectedTabId && setTabId(selectedTabId)
                        console.log({ isSelectedTabId })
                        console.log({ selectedTabId })
                        console.log({ tabId })
                        console.log({ tabIdfromhere: tab.id })
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

            <Minimize
              minimizeWindow={() => minimizeWindow(window.id)}
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

export default OpenedWindows

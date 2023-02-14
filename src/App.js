/* eslint-disable react-hooks/exhaustive-deps */
/*global chrome*/

import { useEffect, useState } from 'react'
import './App.css'
import OpenedWindows from './Components/OpenedWindows/OpenedWindow(s)'
import Navbar from './Components/Nav/Navbar'
import SearchBar from './Components/SearchBar/SearchBar'
import MinimizedWindows from './Components/MinimizedWindows/MinimizedWindows'
import { tab } from '@testing-library/user-event/dist/tab'

function App () {
  const [tabsArray, setTabsArray] = useState([])
  const [windowsArray, setWindowsArray] = useState([])
  const [currentTab, setCurrentTab] = useState({})
  const [currentWindow, setCurrentWindow] = useState({})
  const [search, setSearch] = useState('')
  const [navbarTitle, setNavBarTitle] = useState('')
  const [navbarUrl, setNavBarUrl] = useState('')
  const [tabsToDeleteId, setTabsToDeleteId] = useState([])

  // GET ALL WINDOWS AND TABS
  useEffect(() => {
    chrome.tabs.query({}, function (tabs) {
      setTabsArray(tabs)
    })
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentTab(tabs)
    })

    //TO GET THE CURRENT WINDOW
    chrome.windows.getAll({ populate: true }, function (windows) {
      setWindowsArray(windows)
    })
  }, [])

  useEffect(async () => {
    await chrome.windows.getCurrent({ populate: true }, function (window) {
      setCurrentWindow(window)
    })

    await chrome.windows.onFocusChanged.addListener(async function (windowId) {
      //IF FOCUS  HAS GONE OUT OF A WINDOW
      if (windowId === -1) {
        await chrome.windows.getCurrent({ populate: true }, function (window) {
          setCurrentWindow(window)
        })
      } else {
        await chrome.windows.get(
          windowId,
          { populate: true },
          function (window) {
            setCurrentWindow(window)
          }
        )
      }
    })

    return () => {
      chrome.windows.onFocusChanged.removeListener()
    }
  }, [])

  function deleteSelectedTab () {
    tabsToDeleteId.map(id => {

      return chrome.tabs.remove(id)
    })
  }

  // RE-RENDERS WHEN A NEW WINDOW OR TAB IS CREATED OR REMOVED
  useEffect(() => {
    function getAllWindows () {
      chrome.windows.getAll(
        {
          populate: true
        },
        function (windows) {
          setWindowsArray(windows)
        }
      )
    }
    function handleWindowCreated (newWindow) {
      chrome.windows.get(
        newWindow.id,
        {
          populate: true
        },
        function (window) {
          setWindowsArray(prevWindows => [...prevWindows, window])
        }
      )
    }

    function handleWindowRemoved (removedWindowId) {
      if (removedWindowId) {
        getAllWindows()
      }
    }

    function handleFocusChanged (windowId) {
      if (windowId) {
        getAllWindows()
      }
    }

    function handleTabCreated (tab) {
      if (tab) {
        getAllWindows()
      }
    }

    function handleTabRemoved (tabId) {
      if (tabId) {
        getAllWindows()
      }
    }

    function handleTabActivated ({ tabId, windowId }) {
      if (tabId) {
        getAllWindows()
      }
    }

    getAllWindows()

    chrome.windows.onCreated.addListener(handleWindowCreated)
    chrome.windows.onRemoved.addListener(handleWindowRemoved)
    chrome.windows.onFocusChanged.addListener(handleFocusChanged)
    chrome.tabs.onCreated.addListener(handleTabCreated)
    chrome.tabs.onRemoved.addListener(handleTabRemoved)
    chrome.tabs.onActivated.addListener(handleTabActivated)

    return () => {
      chrome.windows.onCreated.removeListener(handleWindowCreated)
      chrome.windows.onRemoved.removeListener(handleWindowRemoved)
      chrome.windows.onFocusChanged.removeListener(handleFocusChanged)
      chrome.tabs.onCreated.removeListener(handleTabCreated)
      chrome.tabs.onRemoved.removeListener(handleTabRemoved)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  function removeWindow (windowId) {
    chrome.windows.getCurrent(function (currentWindow) {
      chrome.windows.remove(windowId, () => {
        if (windowId) {
          chrome.windows.getAll(
            {
              populate: true
            },
            function (windows) {
              setWindowsArray(windows)
            }
          )
        }
      })
    })
  }

  function minimizeWindow (windowId) {
    chrome.windows.get(windowId, function (window) {
      chrome.windows.update(window.id, { state: 'minimized' })
    })
  }

  function maximizeWindow (windowId) {
    chrome.windows.update(windowId, { state: 'maximized' })
  }

  function addWindow () {
    chrome.windows.create({
      url: 'chrome://newtab',
      width: 800,
      height: 800
    })
  }

  function switchToWindow (windowId) {
    chrome.windows.update(windowId, { focused: true })
    if (windowId.id !== currentWindow.id) {
      chrome.windows.getCurrent(function (currentWindowParam) {
        setCurrentWindow(currentWindowParam)
      })
    }
  }

  function switchToTab (tabId) {
    chrome.tabs.update(tabId, { active: true })
  }

  function pinAtab () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      chrome.tabs.update(tab[0].id, { pinned: true })
    })
  }
  function closeTabOrTabs () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      chrome.tabs.remove(tab[0].id)
    })
  }

  function removeTabs () {}
  function createTabFromWindow (windowId) {
    chrome.tabs.create({ url: 'chrome://newtab', windowId })
    if (windowId) {
      chrome.windows.getAll(
        {
          populate: true
        },
        function (windows) {
          setWindowsArray(windows)
        }
      )
    }
  }

  function searchValue (value) {
    setSearch(value)
  }

  function onHoverTitle (title, url) {
    setNavBarTitle(title)
  }
  function onHoverUrl (url) {
    setNavBarUrl(url)
  }

  return (
    <>
      <main>
        <Navbar
          tabsArray={tabsArray}
          windowsArray={windowsArray}
          title={navbarTitle}
          url={navbarUrl}
        />
        <div className='window-container'>
          <div className='window-content opened-window-container'>
            {windowsArray &&
              windowsArray.map((window, index) => (
                <div>
                  {['normal', 'fullscreen', 'maximized'].includes(
                    window.state
                  ) ? (
                    <OpenedWindows
                      window={window}
                      key={index}
                      {...{
                        minimizeWindow,
                        removeWindow,
                        switchToTab,
                        switchToWindow,
                        search,
                        onHoverTitle,
                        onHoverUrl,
                        createTabFromWindow,
                        setWindowsArray,
                        currentWindow,
                        setTabsToDeleteId,
                        tabsToDeleteId
                      }}
                    />
                  ) : null}
                </div>
              ))}
          </div>

          <div className='window-content'>
            {windowsArray &&
              windowsArray.map((window, index) => (
                <div
                  className={` ${
                    window.state === 'minimized' && 'minimized-container'
                  }`}
                >
                  {window.state === 'minimized' && (
                    <MinimizedWindows
                      window={window}
                      key={index}
                      {...{
                        minimizeWindow,
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
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        <SearchBar
          searchValue={searchValue}
          pinAtab={pinAtab}
          removeTabs={removeTabs}
          onHoverTitle={onHoverTitle}
          addWindow={addWindow}
          closeTabs={closeTabOrTabs}
          deleteSelectedTab={deleteSelectedTab}
          tabsToDeleteId={tabsToDeleteId}
        />
      </main>
    </>
  )
}

export default App

/*global chrome*/

function getTabs () {
  chrome.tabs.query({}, function (tabs) {
    chrome.action.setBadgeText({ text: tabs.length.toString() })
    chrome.action.setBadgeBackgroundColor({ color: '#00FF00' })
  })
}
getTabs()

chrome.tabs.onCreated.addListener(function (newTab) {
  if (newTab) getTabs()
})
chrome.tabs.onRemoved.addListener(function () {
  getTabs()
})

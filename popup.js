document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const status = document.getElementById('status');
  
  // Load saved state
  chrome.storage.sync.get(['enabled'], function(result) {
    const isEnabled = result.enabled || false;
    updateToggleState(isEnabled);
  });
  
  // Handle toggle click
  toggleSwitch.addEventListener('click', function() {
    chrome.storage.sync.get(['enabled'], function(result) {
      const currentState = result.enabled || false;
      const newState = !currentState;
      
      // Save new state
      chrome.storage.sync.set({enabled: newState}, function() {
        updateToggleState(newState);
        
        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggle',
            enabled: newState
          });
        });
      });
    });
  });
  
  function updateToggleState(enabled) {
    if (enabled) {
      toggleSwitch.classList.add('active');
      status.textContent = 'Feature is enabled';
    } else {
      toggleSwitch.classList.remove('active');
      status.textContent = 'Feature is disabled';
    }
  }
}); 
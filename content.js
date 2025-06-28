let isEnabled = false;
let originalTexts = new Map();
let replacements = [];

// Load replacement configuration
fetch(chrome.runtime.getURL('replacements.json'))
  .then(response => response.json())
  .then(data => {
    replacements = data.replacements;
    console.log('Loaded replacements:', replacements);
  })
  .catch(error => {
    console.error('Error loading replacements:', error);
    // Fallback to default replacements
    replacements = [
      { from: "would", to: "wud" },
      { from: "could", to: "cud" }
    ];
  });

// Load saved state when page loads
chrome.storage.sync.get(['enabled'], function(result) {
  isEnabled = result.enabled || false;
  if (isEnabled) {
    replaceText();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggle') {
    isEnabled = request.enabled;
    if (isEnabled) {
      replaceText();
    } else {
      restoreText();
    }
  }
});

function replaceText() {
  // Find all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style tags
        const parent = node.parentElement;
        if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  // Replace text in each node
  textNodes.forEach(textNode => {
    const originalText = textNode.textContent;
    let hasChanges = false;
    let newText = originalText;
    
    // Apply all replacements (both lowercase and capitalized versions)
    replacements.forEach(replacement => {
      // Lowercase version
      const regexLower = new RegExp(replacement.from, 'gi');
      if (newText.includes(replacement.from)) {
        hasChanges = true;
        newText = newText.replace(regexLower, replacement.to);
      }
      
      // Capitalized version
      const capitalizedFrom = replacement.from.charAt(0).toUpperCase() + replacement.from.slice(1);
      const capitalizedTo = replacement.to.charAt(0).toUpperCase() + replacement.to.slice(1);
      const regexCapitalized = new RegExp(capitalizedFrom, 'g');
      if (newText.includes(capitalizedFrom)) {
        hasChanges = true;
        newText = newText.replace(regexCapitalized, capitalizedTo);
      }
    });
    
    if (hasChanges) {
      // Store original text for restoration
      originalTexts.set(textNode, originalText);
      textNode.textContent = newText;
    }
  });
}

function restoreText() {
  // Restore all original texts
  originalTexts.forEach((originalText, textNode) => {
    textNode.textContent = originalText;
  });
  originalTexts.clear();
}

// Handle dynamic content changes
const observer = new MutationObserver(function(mutations) {
  if (isEnabled) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent;
            let hasChanges = false;
            let newText = originalText;
            
            // Apply all replacements (both lowercase and capitalized versions)
            replacements.forEach(replacement => {
              // Lowercase version
              const regexLower = new RegExp(replacement.from, 'gi');
              if (newText.includes(replacement.from)) {
                hasChanges = true;
                newText = newText.replace(regexLower, replacement.to);
              }
              
              // Capitalized version
              const capitalizedFrom = replacement.from.charAt(0).toUpperCase() + replacement.from.slice(1);
              const capitalizedTo = replacement.to.charAt(0).toUpperCase() + replacement.to.slice(1);
              const regexCapitalized = new RegExp(capitalizedFrom, 'g');
              if (newText.includes(capitalizedFrom)) {
                hasChanges = true;
                newText = newText.replace(regexCapitalized, capitalizedTo);
              }
            });
            
            if (hasChanges) {
              originalTexts.set(node, originalText);
              node.textContent = newText;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for text nodes in added elements
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: function(textNode) {
                  const parent = textNode.parentElement;
                  if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                    return NodeFilter.FILTER_REJECT;
                  }
                  return NodeFilter.FILTER_ACCEPT;
                }
              }
            );

            let textNode;
            while (textNode = walker.nextNode()) {
              const originalText = textNode.textContent;
              let hasChanges = false;
              let newText = originalText;
              
              // Apply all replacements (both lowercase and capitalized versions)
              replacements.forEach(replacement => {
                // Lowercase version
                const regexLower = new RegExp(replacement.from, 'gi');
                if (newText.includes(replacement.from)) {
                  hasChanges = true;
                  newText = newText.replace(regexLower, replacement.to);
                }
                
                // Capitalized version
                const capitalizedFrom = replacement.from.charAt(0).toUpperCase() + replacement.from.slice(1);
                const capitalizedTo = replacement.to.charAt(0).toUpperCase() + replacement.to.slice(1);
                const regexCapitalized = new RegExp(capitalizedFrom, 'g');
                if (newText.includes(capitalizedFrom)) {
                  hasChanges = true;
                  newText = newText.replace(regexCapitalized, capitalizedTo);
                }
              });
              
              if (hasChanges) {
                originalTexts.set(textNode, originalText);
                textNode.textContent = newText;
              }
            }
          }
        });
      }
    });
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 
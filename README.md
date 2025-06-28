# Bansal Pro Chrome Extension

A Chrome extension that enhances legibility of web pages by replacing words according to a configurable JSON file. Currently configured to replace various words with shorter, more readable alternatives.

## Features

- **Toggle Functionality**: Turn the text replacement feature on/off with a simple toggle button
- **Configurable Replacements**: Easy to modify word replacements via JSON file
- **Real-time Replacement**: Instantly replaces configured words when enabled
- **Dynamic Content Support**: Works with dynamically loaded content
- **State Persistence**: Remembers your preference across browser sessions
- **Case Insensitive**: Replaces words regardless of case
- **Capitalization Support**: Handles both lowercase and capitalized versions of words

## Current Replacements

The extension is currently configured to replace:
- would → wud (Would → Wud)
- could → cud (Could → Cud)
- should → shud (Should → Shud)
- greater → gr8r (Greater → Gr8r)
- because → cuz (Because → Cuz)
- oo → 00
- seriously → srsly (Seriously → Srsly)
- really → rlly (Really → Rlly)
- your → ur (Your → Ur)
- you → u (You → U)
- pretty → p (Pretty → P)
- between → btwn (Between → Btwn)
- ate → 8 (Ate → 8)
- right → rite (Right → Rite)
- might → migjt (Might → Migjt)
- before → b4 (Before → B4)

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download or Clone** this repository to your local machine

2. **Generate Icons** (if needed):
   - Open `create_icons.html` in your browser
   - The icons will automatically download
   - Move the downloaded icon files to the extension directory

3. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

4. **Load the Extension**:
   - Click "Load unpacked"
   - Select the folder containing the extension files

5. **Pin the Extension** (Optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Pin the "Bansal Pro" extension

### Method 2: Create Icons Manually

If you don't want to use the icon generator, create three PNG files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

## Usage

1. **Click the Extension Icon** in your Chrome toolbar
2. **Toggle the Switch** to enable/disable the feature
3. **Navigate to any webpage** - the replacement will work automatically when enabled

## Configuration

To modify word replacements, edit the `replacements.json` file:

```json
{
  "replacements": [
    {
      "from": "would",
      "to": "wud"
    },
    {
      "from": "could", 
      "to": "cud"
    },
    {
      "from": "should",
      "to": "shud"
    }
  ]
}
```

After modifying the JSON file, reload the extension in `chrome://extensions/` for changes to take effect.

## How It Works

- **Content Script**: Runs on every webpage and handles the text replacement
- **JSON Configuration**: Loads replacement rules from `replacements.json`
- **Popup Interface**: Provides a toggle button and status display
- **Storage**: Saves your preference using Chrome's sync storage
- **Mutation Observer**: Watches for dynamic content changes and applies replacements
- **Case Handling**: Automatically handles both lowercase and capitalized versions of words

## File Structure

```
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for text replacement
├── background.js         # Background service worker
├── replacements.json     # Word replacement configuration
├── create_icons.html     # Icon generator utility
├── README.md             # This file
└── icon*.png             # Extension icons (generated)
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `activeTab`: Access to current tab
  - `storage`: Save user preferences
- **Content Script**: Automatically injected on all pages
- **Background Script**: Minimal service worker for extension lifecycle
- **Web Accessible Resources**: Allows content script to load JSON configuration

## Customization Examples

### Add More Replacements

Edit `replacements.json` to add more word replacements:

```json
{
  "replacements": [
    {"from": "would", "to": "wud"},
    {"from": "could", "to": "cud"},
    {"from": "should", "to": "shud"},
    {"from": "hello", "to": "hi"},
    {"from": "goodbye", "to": "bye"}
  ]
}
```

### Change Replacement Behavior

To modify how replacements work, edit `content.js`. For example, to make replacements case-sensitive:

```javascript
// Change from case-insensitive to case-sensitive
const regexLower = new RegExp(replacement.from, 'g'); // Remove 'i' flag
```

## Troubleshooting

- **Extension not working**: Make sure it's enabled in `chrome://extensions/`
- **Text not replacing**: Check if the page has loaded completely
- **Icons missing**: Generate icons using `create_icons.html` or create your own
- **Replacements not updating**: Reload the extension after modifying `replacements.json`

## Browser Compatibility

- Chrome 88+ (Manifest V3 support required)
- Other Chromium-based browsers (Edge, Brave, etc.)

## License

This project is open source and available under the MIT License. 
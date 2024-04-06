## LinkedIn Automation Chrome Extension

This Chrome extension provides a set of functionalities to automate certain actions on LinkedIn. You can inject a new section with input fields and some buttons, and perform actions such as sending messages, creating new posts, saving text to localStorage, and refreshing the page.

### Installation

1. **Download the Extension Files**:

   - Clone the repository or download the files.

2. **Extract the Files**:

   - Extract the downloaded files to a folder on your computer.

3. **Install the Extension**:

   - Open Chrome Browser.
   - Go to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch at the top right corner.
   - Click on "Load unpacked" and select the folder where you extracted the extension files.

4. **Accessing the Extension**:
   - Once installed, you'll see the extension icon in the Chrome toolbar.

### How to Use

1. **Click on the Extension Icon**:

   - Click on the extension icon in the Chrome toolbar to check if the extension is active.

2. **Using the Functionalities**:
   - After activating the extension, you'll notice a new section added to your LinkedIn feed page with input fields and buttons.
   - You can type your message or text in the input field provided.
   - There are 4 buttons available:
     - **Send**: Sends the typed message to the appropriate input field on the LinkedIn page.
     - **Clear**: Clears the input field.
     - **Save**: Saves the text from the input field to the browser's localStorage.
     - **Refresh**: Refreshes the current page.
   - The extension will automatically detect whether to send messages to comments or create new posts. If a comment section is opened it will send as a comment, otherwise it will create a new post.

### Permissions

- **Active Tab**: Required to inject CSS styles and DOM elements into the LinkedIn page.
- **Storage**: Required to save text to localStorage.
- **Tabs**: Required to refresh the current page.

### Note

- This tool is intended for educational purposes only.
- Some functionalities, such as refreshing the page, may not work outside the context of a Chrome extension due to browser security restrictions.
- I added some variables as configuration to make it easy to change the selectors if needed after some linkedin updates.

### Credits

- Created by Jonatas Souza - jonatasfelipe2@hotmail.com

const sendButton = document.getElementById('sendButton');
const receiveButton = document.getElementById('receiveButton');
const outputDiv = document.getElementById('output');

sendButton.addEventListener('click', async () => {
  const filePath = document.getElementById('filePath').value;
  const destination = document.getElementById('destination').value;
  try {
    const response = await window.__TAURI__.invoke('send_file', { filePath, destination });
    outputDiv.innerText = response;
  } catch (error) {
    outputDiv.innerText = `Error: ${error}`;
  }
});

receiveButton.addEventListener('click', async () => {
  try {
    const response = await window.__TAURI__.invoke('receive_file');
    outputDiv.innerText = response;
  } catch (error) {
    outputDiv.innerText = `Error: ${error}`;
  }
});

const statusDisplay = document.getElementById('status-display');
const responseBody = document.getElementById('response-body');
const apiButtons = document.querySelectorAll('.button-grid button');

// Sends a fetch request using relative URLs and renders status and formatted body
async function callApiEndpoint(url, method) {
  statusDisplay.textContent = `Loading ${method} ${url}...`;
  responseBody.textContent = '';

  try {
    const response = await fetch(url, { method });
    statusDisplay.textContent = `${response.status} ${response.statusText}`;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      // Pretty-print JSON with 2-space indentation
      responseBody.textContent = JSON.stringify(data, null, 2);
    } else {
      const text = await response.text();
      responseBody.textContent = text;
    }
  } catch (error) {
    // Handle network failures gracefully without crashing the page
    statusDisplay.textContent = 'Network Error';
    responseBody.textContent = `Request failed: ${error.message}`;
  }
}

// Attach click event listeners to all API test buttons
apiButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const url = button.dataset.url;
    const method = button.dataset.method;
    callApiEndpoint(url, method);
  });
});
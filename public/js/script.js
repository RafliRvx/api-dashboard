// API Testing functionality
class APITester {
  constructor() {
    this.baseUrl = window.location.origin;
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.loadSampleData();
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('test-btn')) {
        this.handleTestClick(e.target);
      }
    });
  }

  async handleTestClick(button) {
    const card = button.closest('.endpoint-card');
    const method = button.dataset.method;
    const endpoint = button.dataset.endpoint;
    const responseArea = card.querySelector('.response-area');

    responseArea.textContent = 'Testing...';

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // Add body for POST/PUT requests
      if (['POST', 'PUT'].includes(method)) {
        options.body = this.getSampleData(method, endpoint);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      responseArea.textContent = JSON.stringify(data, null, 2);
      responseArea.style.color = response.ok ? '#10b981' : '#ef4444';
    } catch (error) {
      responseArea.textContent = `Error: ${error.message}`;
      responseArea.style.color = '#ef4444';
    }
  }

  getSampleData(method, endpoint) {
    const samples = {
      'POST /api/users': {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      },
      'POST /api/posts': {
        title: 'Sample Post',
        content: 'This is a sample post content',
        author: 'Test User'
      },
      'PUT /api/users/1': {
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    };

    const key = `${method} ${endpoint}`;
    return JSON.stringify(samples[key] || {});
  }

  loadSampleData() {
    // Preload some sample data for testing
    setTimeout(() => {
      const testButtons = document.querySelectorAll('.test-btn[data-method="GET"]');
      testButtons.forEach(btn => {
        if (btn.dataset.endpoint.includes('/api/')) {
          btn.click();
        }
      });
    }, 1000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new APITester();
  
  // Add copy to clipboard functionality
  document.querySelectorAll('.endpoint-url').forEach(element => {
    element.addEventListener('click', () => {
      navigator.clipboard.writeText(element.textContent).then(() => {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        setTimeout(() => {
          element.textContent = originalText;
        }, 2000);
      });
    });
  });
});
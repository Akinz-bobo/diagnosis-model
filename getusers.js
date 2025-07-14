const axios = require('axios');

function getUsers() {
  return axios.get('https://akinz-bobo-model-backend.hf.space/api/v1/users/', {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTI1MjQ3ZS03YmE2LTRkZWUtODU5NS0zMmJlODczNzBkNGIiLCJleHAiOjE3NTU4NTY4MjZ9.ZUjEpHDMZVN1MG8m1ur1d-ntCtnUUrQQUzVB4iNgeDM`,
    }
  })
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching users:', error.message);
      }
      throw error;
    });
}

// Usage
getUsers()
  .then(data => {
    console.log('✅ Fetched users:', data.length, 'users found');
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

import axios from 'axios';

axios.get('http://127.0.0.1:1337/api/products')
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

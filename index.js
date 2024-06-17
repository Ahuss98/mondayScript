const axios = require('axios');

// Monday.com API details
const mondayApiUrl = 'https://api.monday.com/v2';
const mondayHeaders = {
  Authorization: '',
  'Content-Type': 'application/json',
};

// Guestly API details
const guestlyApiUrl = 'https://open-api.guesty.com/v1/listings';
const guestlyHeaders = {
  Authorization: 'Bearer ',
  'Content-Type': 'application/json',
};

// Function to fetch data from Guestly API
async function fetchGuestlyData() {
  try {
    const response = await axios.get(guestlyApiUrl, { headers: guestlyHeaders });
   // console.log('Guestly Data:', response.data); // Log the full response
    return response.data; // Assuming response.data is an object
  } catch (error) {
    console.error('Error fetching data from Guestly:', error.response?.status, error.response?.data);
    return null;
  }
}

// Function to update Monday.com board with Guestly data
async function updateMondayBoard(guestlyData) {
  //console.log(guestlyData)
  let counter = 0
  for (let obj in guestlyData.results) {
    if (guestlyData.results.hasOwnProperty(obj)) {
      const resultsData = guestlyData.results[obj];
      //console.log(resultsData)
      if (resultsData.hasOwnProperty('nickname')) {
        const nicknameAp = resultsData.nickname;
        //console.log(nicknameAp); // or do something with nickname
        counter ++
        const apComplex = resultsData.nickname
        if(apComplex.hasOwnProperty('nickname')){
          const nicknameLocal = apComplex.nickname
          console.log(nicknameLocal)
        }
      }
    }
  }
  //console.log(counter)
  const boardId = ''; 
  //console.log(guestlyData)
  // Assuming guestlyData is an object with properties like listings
  const listings = guestlyData.listings; // actual structure

  for (const itemId in listings) {
    if (listings.hasOwnProperty(itemId)) {
      const columnValue = listings[itemId].nickname; // value to update
      const mutation = `
        mutation {
          change_simple_column_value (board_id: ${boardId}, item_id: "${itemId}", column_id: "contacts", value: "${columnValue}") {
            id
          }
        }
      `;

      try {
        const response = await axios.post(mondayApiUrl, { query: mutation }, { headers: mondayHeaders });
        console.log(`Updated Monday.com item ${itemId}`);
      } catch (error) {
        console.error(`Error updating Monday.com item ${itemId}:`, error.response?.status, error.response?.data);
      }
    }
  }
}

// Main function
async function main() {
  const guestlyData = await fetchGuestlyData();
  if (guestlyData) {
    await updateMondayBoard(guestlyData);
  }
}

main();
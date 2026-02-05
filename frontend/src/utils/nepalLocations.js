/**
 * Nepal Districts, Municipalities, and Wards Data
 * Used for nested dropdown selection in address forms
 */

export const nepalLocationData = {
  "Sunsari": {
    municipalities: [
      { name: "Dharan", wards: 20 },
      { name: "Inaruwa", wards: 14 },
      { name: "Itahari", wards: 19 },
      { name: "Ramdhuni", wards: 10 },
      { name: "Duhabi", wards: 10 },
      { name: "Barahachhetra", wards: 7 },
      { name: "Barju", wards: 6 },
      { name: "Bhokraha Narsingh", wards: 7 },
      { name: "Dewanganj", wards: 7 },
      { name: "Gadhi", wards: 6 },
      { name: "Harinagar", wards: 9 },
      { name: "Koshi", wards: 7 }
    ]
  },
  "Kathmandu": {
    municipalities: [
      { name: "Kathmandu Metropolitan City", wards: 32 },
      { name: "Budhanilkantha", wards: 13 },
      { name: "Chandragiri", wards: 15 },
      { name: "Dakshinkali", wards: 9 },
      { name: "Gokarneshwar", wards: 9 },
      { name: "Kageshwari Manohara", wards: 9 },
      { name: "Kirtipur", wards: 10 },
      { name: "Nagarjun", wards: 10 },
      { name: "Shankharapur", wards: 9 },
      { name: "Tarakeshwar", wards: 11 },
      { name: "Tokha", wards: 11 }
    ]
  },
  "Lalitpur": {
    municipalities: [
      { name: "Lalitpur Metropolitan City", wards: 29 },
      { name: "Godawari", wards: 14 },
      { name: "Mahalaxmi", wards: 10 }
    ]
  },
  "Bhaktapur": {
    municipalities: [
      { name: "Bhaktapur", wards: 10 },
      { name: "Changunarayan", wards: 9 },
      { name: "Madhyapur Thimi", wards: 9 },
      { name: "Suryabinayak", wards: 10 }
    ]
  },
  "Morang": {
    municipalities: [
      { name: "Biratnagar Metropolitan City", wards: 19 },
      { name: "Urlabari", wards: 9 },
      { name: "Pathari Shanishchare", wards: 10 },
      { name: "Sundar Haraicha", wards: 14 },
      { name: "Belbari", wards: 9 },
      { name: "Rangeli", wards: 9 },
      { name: "Ratuwamai", wards: 9 },
      { name: "Letang", wards: 11 },
      { name: "Sundarpur", wards: 8 },
      { name: "Budhiganga", wards: 9 },
      { name: "Gramthan", wards: 6 },
      { name: "Jahada", wards: 6 },
      { name: "Kanepokhari", wards: 7 },
      { name: "Katahari", wards: 9 },
      { name: "Kerabari", wards: 7 },
      { name: "Miklajung", wards: 7 }
    ]
  },
  "Chitwan": {
    municipalities: [
      { name: "Bharatpur Metropolitan City", wards: 29 },
      { name: "Ratnanagar", wards: 16 },
      { name: "Rapti", wards: 13 },
      { name: "Kalika", wards: 11 },
      { name: "Khairhani", wards: 13 },
      { name: "Madi", wards: 9 },
      { name: "Ichchhakamana", wards: 7 }
    ]
  },
  "Pokhara": {
    municipalities: [
      { name: "Pokhara Metropolitan City", wards: 33 }
    ]
  },
  "Dhanusha": {
    municipalities: [
      { name: "Janakpurdham", wards: 25 },
      { name: "Chhireshwarnath", wards: 11 },
      { name: "Ganeshman Charnath", wards: 9 },
      { name: "Dhanushadham", wards: 10 },
      { name: "Nagarain", wards: 11 },
      { name: "Bideha", wards: 9 },
      { name: "Mithila", wards: 12 },
      { name: "Sahidnagar", wards: 11 },
      { name: "Sabaila", wards: 11 },
      { name: "Kamala", wards: 11 },
      { name: "Mithila Bihari", wards: 9 },
      { name: "Hansapur", wards: 9 },
      { name: "Janaknandini", wards: 7 },
      { name: "Bateshwar", wards: 6 },
      { name: "Mukhiyapatti Musaharmiya", wards: 6 },
      { name: "Lakshminiya", wards: 5 },
      { name: "Aurahi", wards: 6 },
      { name: "Dhanauji", wards: 5 }
    ]
  }
};

/**
 * Get all districts
 */
export const getDistricts = () => {
  return Object.keys(nepalLocationData).sort();
};

/**
 * Get municipalities for a specific district
 */
export const getMunicipalities = (district) => {
  if (!district || !nepalLocationData[district]) {
    return [];
  }
  return nepalLocationData[district].municipalities;
};

/**
 * Get number of wards for a specific municipality
 */
export const getWards = (district, municipality) => {
  if (!district || !municipality || !nepalLocationData[district]) {
    return [];
  }
  
  const municipalityData = nepalLocationData[district].municipalities.find(
    m => m.name === municipality
  );
  
  if (!municipalityData) {
    return [];
  }
  
  // Return array of ward numbers [1, 2, 3, ..., n]
  return Array.from({ length: municipalityData.wards }, (_, i) => i + 1);
};

/**
 * Calculate Hirer Profile Completion Percentage
 * 
 * Breakdown:
 * - Basic Info (fullName, email, bio): 40%
 * - Location with Map (address with coordinates): 20%
 * - Phone: 20%
 * - ID Documents Uploaded (all 3 documents): 20%
 * 
 * @param {Object} user - User object from database
 * @returns {Number} Profile completion percentage (0-100)
 */
export const calculateHirerProfileCompletion = (user) => {
  let percentage = 0;

  // Basic Info: 40% (fullName and email are required, so they're always there)
  // Bio contributes the full 40%
  if (user.bio && user.bio.trim().length > 0) {
    percentage += 40;
  }

  // Location with Map: 20%
  if (
    user.address &&
    user.address.latitude &&
    user.address.longitude &&
    user.address.district &&
    user.address.municipality &&
    user.address.ward
  ) {
    percentage += 20;
  }

  // Phone: 20%
  if (user.phone && user.phone.trim().length > 0) {
    percentage += 20;
  }

  // ID Documents Uploaded: 20%
  if (
    user.verificationDocs &&
    user.verificationDocs.citizenshipFront &&
    user.verificationDocs.citizenshipBack &&
    user.verificationDocs.selfieWithId
  ) {
    percentage += 20;
  }

  return percentage;
};

/**
 * Check if hirer profile is complete enough to submit for verification
 * Requires at least phone, address, and all documents
 * 
 * @param {Object} user - User object from database
 * @returns {Boolean} True if profile can be submitted for verification
 */
export const canSubmitForVerification = (user) => {
  const hasPhone = user.phone && user.phone.trim().length > 0;
  
  const hasAddress = 
    user.address &&
    user.address.latitude &&
    user.address.longitude &&
    user.address.district &&
    user.address.municipality &&
    user.address.ward;
  
  const hasAllDocs = 
    user.verificationDocs &&
    user.verificationDocs.citizenshipFront &&
    user.verificationDocs.citizenshipBack &&
    user.verificationDocs.selfieWithId;

  return hasPhone && hasAddress && hasAllDocs;
};

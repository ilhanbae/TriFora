/* This functions checks wether the user profile fields are valid or not.
It also provides suitable message for each error conditions. It checks for following
criteria: 
1. Name fields can't be empty.
2. Name fields should only contain alphabet characters
  a. should consider localizing this for other langauges too
3. Profile image must be a link to only image file
*/
export default function validateUserProfileFields(userProfileFields) {
  let isValid = false;
  let errorMessage = "";
  const alphabet_pattern = /^[a-zA-Z]+$/
  const {firstName, lastName, username, description } = userProfileFields.attributes.profile;

  /* 1. Name fields can't be empty. */
  if (!firstName) {
    errorMessage = "First Name can't be empty"
    return [isValid, errorMessage]
  }
  if (!lastName) {
    errorMessage = "Last Name can't be empty"
    return [isValid, errorMessage]
  }

  /* 2. Name fields should only contain alphabet characters */
  if (!alphabet_pattern.test(firstName)) {
    errorMessage = "First name should only contain alphabet characters"
    return [isValid, errorMessage]
  }

  if (!alphabet_pattern.test(lastName)) {
    errorMessage = "Last name should only contain alphabet characters"
    return [isValid, errorMessage]
  }

  /*username and description error handling */
  if (!username) {
    errorMessage = "Username can't be empty"
    return [isValid, errorMessage]
  }
  if (!description) {
    errorMessage = "Description can't be empty"
    return [isValid, errorMessage]
  }

  if (!alphabet_pattern.test(username)) {
    errorMessage = "Username should only contain alphabet characters"
    return [isValid, errorMessage]
  }

  if (!alphabet_pattern.test(description)) {
    errorMessage = "Description should only contain alphabet characters"
    return [isValid, errorMessage]
  }

  /* No error */
  return [!isValid, errorMessage]
}
/* This function checks whether the email string is valid email address or not.
It also provides suitable message for each error conditions. It checks for following
major rules:
1. Email address can't be empty
2. Email address should contain username and domain name fields
3. Each of the fields should only contain alphanumeric characters 
Note: This validator is not error-proof... */
export default function validateEmail(email) {
  let isValid = false;
  let errorMessage = "";
  const alphanumeric_pattern = /^[0-9a-zA-Z]+$/

  /* 1. email address can't be empty */
  if (!email) {
    errorMessage = "Email can't be empty";
    return [isValid, errorMessage];
  }

  /*2. email address should contain username, domain name, and top-level domain fields */
  const [username, _domain] = email.split("@");

  // check username field exists
  if (!username) {
    console.log(username)

    errorMessage = "Username field can't be empty";
    return [isValid, errorMessage];
  }
  // check domain field exists
  if (!_domain) {
    errorMessage = "Domain can't be empty";
    return [isValid, errorMessage];
  }

  // Check domain includes more than one dot delimiter
  if (_domain.split('.').length !== 2) {
    errorMessage = "Bad domain"
    return [isValid, errorMessage]
  }
  const [domainName, topLevelDomain] = _domain.split('.').filter(c => c)
  
  // check domain name field exists
  if (!domainName) {
    errorMessage = "Domain name can't be empty";
    return [isValid, errorMessage];
  }
  // check top level domain field exists
  if (!topLevelDomain) {
    errorMessage = "Top Level Domain can't be empty";
    return [isValid, errorMessage];
  }

  /* 3. Each of the fields should only contain alphanumeric characters */

  // check username field
  if (!alphanumeric_pattern.test(username)){
    errorMessage = "Username should only contain alphanumeric characters";
    return [isValid, errorMessage];    
  }
  // check domain name field
  if (!alphanumeric_pattern.test(domainName)){
    errorMessage = "Domain name should only contain alphanumeric characters";
    return [isValid, errorMessage];    
  }
  // check top level domain field
  if (!alphanumeric_pattern.test(topLevelDomain)){
    errorMessage = "Top Level Domain should only contain alphanumeric characters";
    return [isValid, errorMessage];    
  }

  const emailInput = document.getElementById('email')
  if (errorMessage) {
    emailInput.setCustomValidity(errorMessage);
    emailInput.reportValidity();
  } else {
    emailInput.setCustomValidity("");
    emailInput.reportValidity();

  }

  // No error
  return [!isValid, errorMessage]
}

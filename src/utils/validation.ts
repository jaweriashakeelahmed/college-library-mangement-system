export const validatePassword = (password: string) => {
  const isLength = password.length >= 8 && password.length <= 64;
  const isUpper = /[A-Z]/.test(password);
  const isLower = /[a-z]/.test(password);
  const isNumber = /[0-9]/.test(password);
  const isSpecial = /[@#$%^&*!?_]/.test(password);
  
  const score = [isLength, isUpper, isLower, isNumber, isSpecial].filter(Boolean).length;
  
  let strength = 'Weak';
  if (score === 5) strength = 'Very Strong';
  else if (score === 4) strength = 'Strong';
  else if (score === 3) strength = 'Good';
  else if (score === 2) strength = 'Fair';

  return {
    isValid: isLength && isUpper && isLower && isNumber && isSpecial,
    requirements: { isLength, isUpper, isLower, isNumber, isSpecial },
    strength
  };
};

export const validateEmail = (email: string) => {
  const trimmed = email.trim().toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return { email: trimmed, isValid };
};

export const validatePhone = (phone: string) => {
  const trimmed = phone.trim();
  const isValid = /^03\d{9}$/.test(trimmed);
  return { phone: trimmed, isValid };
};

export const validateRollNumber = (rollNo: string) => {
  const trimmed = rollNo.trim().toUpperCase();
  // Format like 2k24/CS/12, 2k24/DS/9, 2k24/Computer Science/12
  const isValid = /^2K\d{2}\/[A-Z &]+\/\d+$/.test(trimmed);
  return { rollNo: trimmed, isValid };
};

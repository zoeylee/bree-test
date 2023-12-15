const validateInput = {
  notEmpty: (value) => {
    if (value === null || value === undefined) {
      return false;
    }
  
    if (typeof value === 'string' && value.trim().length === 0) {
      return false;
    }
    return true;
  },
};

export default validateInput;

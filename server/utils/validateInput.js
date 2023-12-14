const validateInput = {
  integer: (value) => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return false;
    }
    var n = Number(value);
    return Number.isInteger(n) && n >= 0;
  },

  notNull: (value) => {
    return value !== null && value !== undefined;
  },
};

export default validateInput;

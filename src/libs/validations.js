const validations =  {
  required: value => value && value.trim() ? undefined : 'This field is required',
  max: maxLength => value => parseInt(value, 10) <= maxLength
    ? undefined
    : `The duration needs to be less than ${maxLength} hours`,
};

export default validations;

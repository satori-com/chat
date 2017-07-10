import React from 'react';
import Types from 'prop-types';

const FormField = props => {
  const {
    input,
    inputClassName,
    placeholder,
    maxLength,
    type,
    meta: { touched, error }
  } = props;

  return (
    <div className="form-group form-group-lg">
      <input
      {...input}
      className={inputClassName}
      placeholder={placeholder}
      maxLength={maxLength}
      type={type}
      />
      {touched && error && <span className="text--error">{error}</span>}
    </div>
  )
};

FormField.propTypes = {
  input: Types.object.isRequired, // provided by redux form
  inputClassName: Types.string,
  placeholder: Types.string.isRequired,
  type: Types.string,
  maxLength: Types.number,
  meta: Types.shape({
    touched: Types.bool.isRequired,
    error: Types.string,
  }),
};

FormField.defaultProps = {
  inputClassName: '',
  type: 'text',
  maxLength: 100,
};

export default FormField;

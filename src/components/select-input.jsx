import React from 'react';
import Select from 'react-select';

export default (props) => (
  <div>
    <Select
      {...props}
      value={props.input.value || props.initialValue}
      onChange={(value) => props.input.onChange(value)}
      onBlur={() => props.input.onBlur(props.input.value)}
      options={props.options}
    />
    {props.label &&
      <label className='select-label'>
        {props.label}
      </label>
    }
  </div>
);

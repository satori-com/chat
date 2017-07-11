import React from 'react';
import Types from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Countdown from 'react-cntdwn';
import FormField from './form-field';
import validations from '../libs/validations';
import { getExpirationDate } from '../libs/utils';

const JoinChatForm = props => {
  const { expiration, handleSubmit, status, submitting, valid } = props;

  return (
    <form
      onSubmit={handleSubmit}
    >
      <Field
        inputClassName="form-control"
        name="userName"
        component={FormField}
        placeholder="Your name"
        type="text"
        maxLength={25}
        validate={[validations.required]}
        autoFocus
      />
      {
        status === 'started'
          ? (<div>
            <p className="expiration-preamble">This chat will expire in</p>
            <Countdown
              targetDate={getExpirationDate(expiration)}
              format={{hour: 'hh', minute: 'mm', second: 'ss'}}
              timeSeparator={':'}
              leadingZero={true}
            />
          </div>)
          : <p className="notStartedMsg">This chat has not started yet</p>
      }
      <button
        className="btn btn-primary joinChat-button"
        disabled={submitting || !valid}
        type="submit"
      >
        Join Chat
      </button>
    </form>
  );
};

JoinChatForm.propTypes = {
  expiration: Types.number,
  status: Types.oneOf([
    'created',
    'started',
  ]),
  /* from redux-form */
  handleSubmit: Types.func.isRequired,
  submitting: Types.bool.isRequired,
};

export default reduxForm({ form: 'join-chat' })(JoinChatForm)

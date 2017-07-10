import React from 'react';
import Types from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getUser } from '../redux/user'
import FormField from './form-field';
import SelectInput from './select-input';
import validations from '../libs/validations';

let CreateChatChannelForm = props => {
  const { handleSubmit, submitting, valid } = props;

  const durationOptions = [
    {'label': '1:00', 'value': 1},
    {'label': '2:00', 'value': 2},
    {'label': '3:00', 'value': 3},
    {'label': '4:00', 'value': 4},
    {'label': '5:00', 'value': 5},
    {'label': '6:00', 'value': 6},
  ];

  return (
    <form
      className="createChat-form"
      onSubmit={handleSubmit}
    >
      <Field
        inputClassName="form-control"
        name="topic"
        component={FormField}
        placeholder="Give your chat a topic..."
        type="text"
        maxLength={25}
        validate={[validations.required]}
        autoFocus
      />
      <Field
        inputClassName="form-control"
        name="creatorName"
        component={FormField}
        placeholder="Your name..."
        type="text"
        maxLength={25}
        validate={[validations.required]}
        autoFocus
      />
      <Field
        name="duration"
        className="durationSelect"
        options={durationOptions}
        component={SelectInput}
        label="Duration (hours)"
        clearable={false}
        searchable={false}
        initialValue={{label: '1:00', value: 1}}
      />
      <button
        disabled={submitting || !valid}
        type="submit"
        className="btn btn-primary createChat-button"
      >
        Create New Chat
      </button>
    </form>
  );
};

CreateChatChannelForm.propTypes = {
  /* from redux-form */
  handleSubmit: Types.func.isRequired,
  submitting: Types.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    initialValues: {
      creatorName: state.me.get('name'),
      duration: {label: '1:00', value: 1},
    }
  }
}

CreateChatChannelForm = reduxForm({ form: 'create-chat-channel' })(CreateChatChannelForm);
CreateChatChannelForm = connect(mapStateToProps, { getUser })(CreateChatChannelForm);

export default CreateChatChannelForm;


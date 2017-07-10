import React from 'react';
import Types from 'prop-types';
import classNames from 'classnames';
import { lowercaseFirst } from '../libs/utils';

const bots = [{
  id: 'weatherBot',
  text: 'Weather Bot'
}];

const botQuestions = [{
  botId: 'weatherBot',
  questions: [{
    id: 'localAlerts',
    text: 'What are my local weather alerts?',
  }, {
    id: 'floodAlerts',
    text: 'Are there any flood alerts in the US?',
  }, {
    id: 'majorAlerts',
    text: 'Are there any alerts in the US with major severity?',
  }]
}];

class BotSelector extends React.Component {
  constructor(props) {
    super(props);
    this.boundEscapeListener = this.escapeListener.bind(this);

    this.state = {
      stage: 0,
      selectedBotId: null,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.boundEscapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.boundEscapeListener);
  }

  escapeListener(e) {
    if (e.key === 'Escape') {
      this.closeWidget();
    }
  }

  closeWidget() {
    this.setState({ stage: 0, selectedBotId: null });
    this.props.onDeactivate();
  }

  generateQuestionText(botId, questionId) {
    const botTitle = bots.find(bot => bot.id === botId).text;
    const botQs = botQuestions.find(data => data.botId === botId);
    const questionText = lowercaseFirst(botQs.questions.find(q => q.id === questionId).text);
    return `${botTitle}, ${questionText}`;
  }

  selectBot(id) {
    this.setState({
      selectedBotId: id,
      stage: 1,
    });
  }

  selectQuestion(questionId) {
    this.props.onComplete({
      botId: this.state.selectedBotId,
      questionId: questionId,
      questionText: this.generateQuestionText(this.state.selectedBotId, questionId),
    });
    this.closeWidget();
  }

  renderStage0() {
    return bots.map((bot) => {
      return (
        <li
          className="botSelector-item botImage"
          onClick={() => this.selectBot(bot.id)}
          key={bot.id}
        >
          {bot.text}
        </li>
      );
    });
  }

  renderStage1() {
    const { selectedBotId } = this.state;
    const botQs = botQuestions.find(data => data.botId === selectedBotId);

    return botQs.questions.map((question) => {
      return (
        <li
          className="botSelector-item"
          onClick={() => this.selectQuestion(question.id)}
          key={question.id}
        >
          {question.text}
        </li>
      );
    });
  }

  render() {
    const { isVisible } = this.props;
    const { stage } = this.state;

    return (
      <div className={classNames('botSelector', { 'botSelector--hidden': !isVisible })}>
        <div className="botSelector-header">
          <div className="botSelector-header-title">Bot list</div>
          <div className="botSelector-header-hint" onClick={() => this.closeWidget()}>esc to
            dismiss
          </div>
        </div>
        <ul className="botSelector-body">
          {stage === 0 ? this.renderStage0() : this.renderStage1()}
        </ul>
      </div>
    );
  }
}

BotSelector.propTypes = {
  isVisible: Types.bool.isRequired,
  onComplete: Types.func.isRequired,
  onDeactivate: Types.func.isRequired,
};

BotSelector.defaultProps = {
  isVisible: false,
};

BotSelector.displayName = 'BotSelector';

export default BotSelector;

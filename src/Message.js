import React, { PropTypes } from 'react'
import {emojify} from 'react-emojione';

class Message extends React.Component {
	floatLeftOrRight () {
		if (this.props.localUser === this.props.user) {
			return "floatMessageRight"
		
		} else {

			return "floatMessageLeft"
		}
	}

	showUserName () {
		if (this.props.showName) {
			return this.props.user;
		}
	}

	renderEmojiOrMessage () {
		var parsedString = this.props.message.split('=')
		if (this.props.message.indexOf('localEmojiGif') > -1) {

			return (
			<div>
				<img
					className='gifEmoji'
					src={require('../public/'+ parsedString[1] + '.gif')}
					role="presentation"/>
			</div>
		)	

		} else {

			return (
				<div title={this.props.time} className="messageText">{emojify(this.props.message.toString())}</div>
			)
		}
	}

	render () {
		return (
			<div className="messageContainer">
				<div className={this.floatLeftOrRight()}>
					<div className="messageUserName">{this.showUserName()}</div>
					{this.renderEmojiOrMessage()}
				</div>
			</div>
		)
	}
}

Message.propTypes = {
	localUser: PropTypes.string,
	user: PropTypes.string,
	message: PropTypes.string,
	time: PropTypes.string.isRequired,
	showName: PropTypes.bool

};

export default Message;
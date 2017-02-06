import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import Message from './Message'
import moment from 'moment'

class UserScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {textBoxvalue: ''};
		this.handleTextSubmit = this.handleTextSubmit.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.messageContainerReference = this.messageContainerReference.bind(this)
		this.recentMoment;
	}

   	messageContainerReference (messagesContainer) {
   		if (messagesContainer) {
   			this.messagesContainer = messagesContainer
   		}
   	}

   	renderMessages () {
   		var user = this.props.user
         console.log('props usertyping: ', this.props.userTyping)
         console.log('user: ', this.props.user)
         var lastUser;
   		var messages = this.props.chatLog.map(function(message) {
            var showName = (message.user !== lastUser) && (message.user !== user) ? true : false
            lastUser = message.user
   			return (<Message
   				localUser={user}
   				user={message.user}
   				message={message.message}
   				time={message.time}
               showName={showName}/>)
   		})
   		if (this.props.userTyping.length && this.props.userTyping !== this.props.user) {
   			var toReturn = (
   				<div
   					ref={this.messageContainerReference}
   					className="messagesContainer">
   					{messages}
   				<div className="spaceOrTyping">
   					<span className="userIsTyping">{this.props.userTyping} is typing...</span>
   				</div>
   				</div>
   			)
   			return toReturn
   		} else {
   			return (
   				<div
   					ref={this.messageContainerReference}
   					className="messagesContainer">
                  <div className="dateTime">{this.props.chatDate}</div>
   					{messages}
   					<div className="spaceOrTyping"></div>
   				</div>)
   		}

   	}

   	handleTextSubmit (event) {
   		if (event.keyCode === 13) {
   			event.preventDefault()
   		}
   		this.props.updateUserTyping(this.props.user)
   		this.setState({textBoxvalue: event.target.value})
   	}

   	getMoment () {
   		console.log('calling getmoment')
   		console.log('recentmoment: ', this.recentMoment)
   		var momentLocal = moment().format('LT')
   		if (this.recentMoment === momentLocal) {
   			console.log('in true statement')
   			return ""
   		} else {
   			console.log('in else statement')
   			this.recentMoment = momentLocal
   			return momentLocal
   		}
   		
   	}

   	handleSubmit (event) {
   		if (event.key === 'Enter') {
   			event.preventDefault();
   			this.props.updateChatLog({
   				user: this.props.user,
   				message: this.state.textBoxvalue,
   				time: this.getMoment()
   			})
   			this.setState({textBoxvalue: ''})
   		}
   		
   	}

   	handleChange (event) {
   		console.log('event: ', event)
   	}

	componentDidUpdate () {
	    var node = this.messagesContainer;
	    // console.log('node: ', node)
	    if (node) {
	    	node.scrollTop = node.scrollHeight
	    }
	  // }
	}

   	renderTextInput () {
   		return (<div className="textInputContainer">
       			<input 
       				className="textBoxInput"
       				type="text"
       				value={this.state.textBoxvalue}
       				onChange={this.handleTextSubmit}
     				onKeyDown={this.handleSubmit}
       				placeholder="  Type a message..."
       				/>
      		</div>)
   	}

	render () {
		return (
			<div className="userScreen">
				{this.renderMessages()}
				{this.renderTextInput()}
			</div>
		)
	}
}

UserScreen.proptypes = {
		user: PropTypes.string,
		chatLog: PropTypes.array,
		updateChatLog:PropTypes.func,
		updateUserTyping: PropTypes.func,
		updateUser: PropTypes.func,
		alignUserScreen: PropTypes.string,
		userTyping: PropTypes.string,
      chatDate: PropTypes.string
};

export default UserScreen
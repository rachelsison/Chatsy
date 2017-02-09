import React, { PropTypes } from 'react'
import _ from 'lodash'
import Message from './Message'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard';

class UserScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         textBoxvalue: '',
         copied: false
      };
		this.handleTextSubmit = this.handleTextSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.messageContainerReference = this.messageContainerReference.bind(this);
      this.renderCopyOrCopiedButton = this.renderCopyOrCopiedButton.bind(this);
      this.renderEmoticonButtons = this.renderEmoticonButtons.bind(this);
      this.updateChatLogWithEmoticon = this.updateChatLogWithEmoticon.bind(this);
      this.returnMembersString = this.returnMembersString.bind(this);
		this.recentMoment = ''
	}

	messageContainerReference (messagesContainer) {
		if (messagesContainer) {
			this.messagesContainer = messagesContainer;
		}
	}

	renderMessages () {
		var localUser = this.props.user;
      var lastUser;
		var messages = this.props.chatLog.map(function(message) {
         if (message) {
            var showName = (message.user !== lastUser) && (message.user !== localUser) ? true : false;
            lastUser = message.user !== localUser ? message.user : lastUser;
   			return (<Message
   				localUser={localUser}
   				user={message.user}
   				message={message.message}
   				time={message.time}
               showName={showName}/>)
         }
		})
		if (this.props.userTyping.length && this.props.userTyping !== localUser) {
         var toReturn = (
				<div
					ref={this.messageContainerReference}
					className="messagesContainer">
					{messages}
				<div className="spaceOrTyping">
               <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
               </div>
            </div>
				</div>
			)
			return toReturn;
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
			event.preventDefault();
		}
		this.props.updateUserTyping(this.props.user);
		this.setState({textBoxvalue: event.target.value});
	}

	getMoment () {
		var momentLocal = moment().format('LT');
		if (this.recentMoment === momentLocal) {
			return "";
		} else {
			this.recentMoment = momentLocal;
			return momentLocal;
		}
		
	}

   handleSubmit(event) {
      if (event.key === 'Enter') {
         event.preventDefault();
         this.props.updateChatLog({
            user: this.props.user,
            message: this.state.textBoxvalue,
            time: this.getMoment()
         })
         this.props.clearUserTyping()
         this.setState({
            textBoxvalue: ''
         })
      }

   }

   renderCopyOrCopiedButton () {
      if (!this.state.copied) {
         return (<CopyToClipboard text={document.location.href}
           onCopy={() => this.setState({copied: true})}>
           <span className="chatButton">Click to Copy Chat Link</span>
         </CopyToClipboard>)
      } else {
         return (
            <div className="linkCopied">Link has been copied!</div>
         )
      }
   }


   componentDidUpdate() {
      var node = this.messagesContainer;
      if (node) {
         node.scrollTop = node.scrollHeight;
      }
   }

   componentDidMount () {
      var node = this.messagesContainer;
       if (node) {
         node.scrollTop = node.scrollHeight;
       }
   
   }

	renderTextInput () {
		return (
         <div className="textInputContainer">
    			<input 
    				className="messageInputBox"
    				type="text"
    				value={this.state.textBoxvalue}
    				onChange={this.handleTextSubmit}
  				   onKeyDown={this.handleSubmit}
    				placeholder="  Type a message..."
    				/>
   		</div>)
	}

   updateChatLogWithEmoticon (emotion) {
      this.props.updateChatLog({
                        user: this.props.user,
                        message: "localEmojiGif=" + emotion,
                        time: this.getMoment()
                     })
   }

   renderEmoticonButtons () {
      var emotions = ['happy', 'angry', 'bye', 'hi', 'sad', 'whistle', 'worry', 'xd'];
      var buttons = emotions.map(function(emotion) {
         return (
               <img
                  role="presentation"
                  className="emojiPNG"
                  title={emotion}
                  src={require('../public/' + emotion + '.png')}
                  onClick={this.updateChatLogWithEmoticon.bind(this, emotion)}
                  />)
      }.bind(this))
      return buttons;
   }

   returnMembersString () {
      var members = this.props.chatMembers;
      var string = '';
      for (var i=0; i < members.length; i++) {
         if (members[i] !== this.props.user) {
            string += members[i];
            string += ', ';
         } 
      }
      if (string[string.length - 2] === ',') {
         string = string.slice(0, string.length - 2);
      }
      return string;
   }

	render () {
      if (this.state.copied) {
      setTimeout(function () {
        this.setState({copied: false})}.bind(this), 3000)
    }
		return (
			<div className="userScreen">
            <div className="memberNames">{this.returnMembersString()}</div>
				{this.renderMessages()}
            <div className="buttonsContainer">
               <div className="chatButton" onClick={this.props.createNewChannel}>Create New Chat</div>
               {this.renderCopyOrCopiedButton()}
               {this.renderEmoticonButtons()}
            </div>
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
      chatDate: PropTypes.string,
      clearUserTyping: PropTypes.func,
      createNewChannel: PropTypes.func,
      chatMembers: PropTypes.array
};

export default UserScreen;
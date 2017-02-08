import React from 'react';
import UserScreen from './UserScreen';
import _ from 'lodash';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment'
import randomstring from 'randomstring';
import CopyToClipboard from 'react-copy-to-clipboard';

var config = {
  apiKey: "AIzaSyBE88kR1qk1BcZ42m5qpxwEASbJbQ-Unrk",
  authDomain: "chatty-40852.firebaseapp.com",
  databaseURL: "https://chatty-40852.firebaseio.com",
  storageBucket: "chatty-40852.appspot.com",
  messagingSenderId: "1059490176611"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localUser: null,
      chatLog: [],
      userTyping: '',
      chatDate: null,
      channelID: null,
      chatMembers: []
    };
    this.clearChatLog = this.clearChatLog.bind(this);
    this.updateChatLog = this.updateChatLog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderNamePrompt = this.renderNamePrompt.bind(this);
    this.updateUserTyping = this.updateUserTyping.bind(this);
    this.clearUserTyping = this.clearUserTyping.bind(this);
    this.parseKeyFromUrl = this.parseKeyFromUrl.bind(this);
    this.render = this.render.bind(this);
    this.createNewChannel = this.createNewChannel.bind(this);
    this.createDatabases = this.createDatabases.bind(this);
    this.loadArchivedChannel = this.loadArchivedChannel.bind(this);
    this.setMember = this.setMember.bind(this);
    this.renderUserScreen = this.renderUserScreen.bind(this);
  }
  
  clearChatLog () {
    this.firebaseRef.remove();
    this.setState({chatLog: []})
  }

  updateChatLog (messageObject) {
    var chatLog = this.state.chatLog
    chatLog.push(messageObject)
    this.firebaseMessages.child(this.state.channelID).push(messageObject)
    this.setState({chatLog: chatLog})
  }

  componentWillMount() {
    var currentBrowserURL = document.location.href
    if (currentBrowserURL.indexOf('channel=') > -1) {
      var urlKey = this.parseKeyFromUrl(document.location.href)
      this.createDatabases()
      this.loadArchivedChannel(urlKey)
    } else {
      this.createDatabases();
      this.createNewChannel()
    }

  }

  loadArchivedChannel (urlKey) {
    var channelID = urlKey;
    this.firebaseChannels.child(channelID).on('child_changed', (snap) => {
      var updated = snap.val()
      this.setState({userTyping: updated})
    })
    var messagesList = this.firebaseMessages.child(channelID)
    messagesList.on('value', snap => {
        const currentMessages = snap.val();
        var chatLog = []
        var chatMembers = {}

        for (var key in currentMessages) {
          var  member = currentMessages[key].user
          if (!chatMembers[member]) {
            chatMembers[member] = true
          }
          chatLog.push(currentMessages[key])
      }
      if (this.state.chatLog.length && chatLog[chatLog.length - 1].user !== this.state.localUser){
        var audio = new Audio('chat.mp3')
        audio.play()
      }
      this.setState({
        chatLog: chatLog,
        chatDate: moment().format('MMM Do, h:mm a'),
        channelID: channelID,
        chatMembers: Object.keys(chatMembers)

      })

    })
    messagesList.on('child_changed', (snap) => {
      var audio = new Audio('chat.mp3')
      audio.play()
    })
  }

  parseKeyFromUrl (url) {
    var splitUrl;
    if (url === undefined) {
      return
    }
    // if reading a firebase url
    if (url.indexOf('firebase') > -1) {
      splitUrl = url.split('/')
      return splitUrl[splitUrl.length - 1]
    } else {
      // if reading browser url
      return url.split('?')[1].split('=')[1]
    }
  }

  createNewChannel (channelObject) {
    var channelID= randomstring.generate(7)
    var toPush = {}
    toPush[channelID] = {channelName: 'testchannel', userTyping: '', members:[this.state.localUser]}
    this.firebaseChannels.push(toPush)
    this.firebaseChannels.child(channelID).on('child_changed', snap => {
    })
    var messagesList = this.firebaseMessages.child(channelID)
    messagesList.on('value', snap => {
        const currentMessages = snap.val();
        var chatLog = []
        for (var key in currentMessages) {
          chatLog.push(currentMessages[key])
      }
      this.setState({chatLog: chatLog, chatDate: moment().format('MMM Do, h:mm a')})

    })
    window.history.pushState('object or string', 'Title', '?channel=' + channelID)
    this.setState({channelID: channelID})
  }

  createDatabases () {
    this.firebaseChannels = firebase.database().ref('/channels')
    this.firebaseChannels.on('value', (snapshot) => {
      const allChannels = snapshot.val()
    })
    this.firebaseMessages = firebase.database().ref('/messages')
  }

  handleSubmit (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({localUser: event.target.value})
      }
  }

  renderNamePrompt () {
    var setMember = this.setMember
    var members = this.state.chatMembers.map(function (member) {
      return (<div className="chooseMemberName" onClick={() => setMember(member)}>{member}</div>)
    })
    var placeholderString = this.state.chatMembers.length ? "Choose your name from above or enter a new name ..." : "Please enter your name.."
    if (!this.state.localUser) {
      return (
        <div className="namePromptContainer">
          <div className="inputContainer">
          <div>{members}</div>
            <input 
              className="textBoxInput"
              type="text"
              onKeyDown={this.handleSubmit}
              placeholder={placeholderString}
              />
          </div>
        </div>
      )
    }
  }

  clearUserTyping () {
    this.firebaseChannels.child(this.state.channelID).update({userTyping: ''})
    this.setState({userTyping: ''})
  }

  updateUserTyping (user) {
    this.firebaseChannels.child(this.state.channelID).update({userTyping: user})
    this.setState({userTyping: user})
  }
  handleChannelSubmit (event) {
    this.createNewChannel({
      channelName: event.target.value,
      members: [this.state.user],
      userTyping: ''
    })
  }
  setMember (member) {
    this.setState({localUser: member})
  }
  renderChannelPrompt () {
    var members = this.state.chatMembers.map(function (member) {
      return (<div className="chooseMemberName" onClick={() => this.setMember(member)}>{member}</div>)
    })
    return (
      <div className="namePromptContainer">
          <div className="inputContainer">
            <input 
              className="textBoxInput"
              type="text"
              onKeyDown={this.handleChannelSubmit}
              placeholder="Please enter a name for your channel ..."
              />
            }
          </div>
        </div>
    )
  }
  renderUserScreen () {
    if (this.state.localUser) {
      return (
        <UserScreen
          user={this.state.localUser}
          chatLog={this.state.chatLog}
          updateChatLog={this.updateChatLog}
          userTyping={this.state.userTyping}
          updateUserTyping={this.updateUserTyping}
          updateUser={this.updateUser1}
          chatDate={this.state.chatDate}
          clearUserTyping={this.clearUserTyping}
          />
      )
    }
  }

  render () {
    return (
      <div className="app-container">
        <div className="app-content">
          <div className="appHeadContainer">
            <div className="innerContainer">
              <div className="clearChatLogButton" onClick={this.createNewChannel}>Create New Chat</div>
              <CopyToClipboard text={document.location.href}
                onCopy={() => this.setState({copied: true})}>
                <span className="clearChatLogButton">Click to Copy Chat Link</span>
              </CopyToClipboard>
            </div>
          </div>
          {this.renderNamePrompt()}
          {this.renderUserScreen()}
        </div>
      </div>
    );
  }
};

export default App;
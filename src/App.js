import React from 'react';
import UserScreen from './UserScreen';
import _ from 'lodash';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment'
import randomstring from 'randomstring';

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
    console.log('updatedChatLog:', chatLog)
    // this.firebaseRef.push({
    //   message: messageObject
    // }).then((snap) => {console.log('snap.key: ', snap.toString())})
    this.firebaseMessages.child(this.state.channelID).push(messageObject)
    this.setState({chatLog: chatLog})
  }

  componentWillMount() {
    // this.firebaseRef = firebase.database().ref('/items')
    // var message = this.firebaseRef.child('-KcKRPFv54Msr_Ultlmw').push('hello mom')
    // console.log('firebaseref message object? ', message)
    // this.firebaseRef.on('value', (dataSnapshot) => {
    //   const currentMessages = dataSnapshot.val();
    //   console.log('snapshot key: ', dataSnapshot)
    //   var chatLog = []
    //   for (var key in currentMessages) {
    //     chatLog.push(currentMessages[key].message)
    //     console.log('keyyy: ', key)
    //   }
    //   this.setState({chatLog: chatLog, chatDate: moment().format('MMM Do, h:mm a')})
    //   console.log('database chatLog: ', chatLog)
    //   console.log('currentMessages: ', currentMessages)
    //   console.log('currentmessage one message: ', currentMessages['-KcKRPFv54Msr_Ultlmw'])
    //   console.log('URL KEY!! ', this.parseKeyFromUrl(document.location.href))
    // })
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
    console.log('in loadArchivedChannel, urlkey: ', urlKey)
    var channelID = urlKey;
    this.firebaseChannels.child(channelID).on('child_changed', (snap) => {
      var updated = snap.val()
      console.log('channelupdated_______________: ', updated)
      this.setState({userTyping: updated})
    })
    var messagesList = this.firebaseMessages.child(channelID)
    console.log('messagesList in loadArchivedChannel: ', messagesList)
    messagesList.on('value', snap => {
      console.log('messagesList in DB: ', snap.val());
        const currentMessages = snap.val();
        var chatLog = []
        var chatMembers = {}
        for (var key in currentMessages) {
          var  member = currentMessages[key].user
          console.log('currentMessages[key]: ', member)
          if (!chatMembers[member]) {
            chatMembers[member] = true
          }
          chatLog.push(currentMessages[key])
          console.log('chatmembers getting ready to push: ', chatMembers)
          console.log('keyyys in archived channel: ', key)
      }
      console.log('toupdatechatlog: ', chatLog)
      this.setState({
        chatLog: chatLog,
        chatDate: moment().format('MMM Do, h:mm a'),
        channelID: channelID,
        chatMembers: Object.keys(chatMembers)

      })

    })
  }

  parseKeyFromUrl (url) {
    console.log('in parseKeyFromUrl function, url: ', url)
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

  /* 
    channelObject = {
      channelName: 'channel1',
      userTyping: '',
      members: []
    }
    messages = {
      channelID: [
        message: {message: 'hello', user: 'Jane', time: moment().format('LT'), date: moment().format('MMM Do, h:mm a')}
      ]
    }
  */
  createNewChannel (channelObject) {
    var channelID= randomstring.generate(7)
    console.log('channelID: ', channelID)
    var toPush = {}
    toPush[channelID] = {channelName: 'testchannel', userTyping: '', members:[this.state.localUser]}
    this.firebaseChannels.push(toPush)
    console.log('channelID: ', channelID)
    this.firebaseChannels.child(channelID).on('child_changed', snap => {
      console.log('channelupdated: ', snap.val())
    })
    var messagesList = this.firebaseMessages.child(channelID)
    console.log('messagesLIST: ', messagesList)
    messagesList.on('value', snap => {
      console.log('messagesList in DB: ', snap.val());
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
    console.log('in createDatabases')
    this.firebaseChannels = firebase.database().ref('/channels')
    this.firebaseChannels.on('value', (snapshot) => {
      const allChannels = snapshot.val()
    })
    // var channelID = this.createNewChannel()
    this.firebaseMessages = firebase.database().ref('/messages')
    this.firebaseMessages.on('value', (snapshot) => {
      console.log(snapshot.val())
      // var currentMessages = snapshot.val();
      // var chatLog = []
      // for (var key in currentMessages) {
      //   chatLog.push(currentMessages[key].message)
      // }
      // this.setState({
      //   chatLog: chatLog,
      //   chatDate: moment().format('MMM Do, h:mm a')
      // })
    })

  }

  handleSubmit (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({localUser: event.target.value})
      }
  }

  renderNamePrompt () {
    var setMember = this.setMember
    console.log('renderingNamePrompt')
    var members = this.state.chatMembers.map(function (member) {
      console.log('MEMBER: ', member)
      return (<div className="chooseMemberName" onClick={() => setMember(member)}>{member}</div>)
    })
    if (!this.state.localUser) {
      return (
        <div className="namePromptContainer">
          <div className="inputContainer">
          <div>{members}</div>
            <input 
              className="textBoxInput"
              type="text"
              onKeyDown={this.handleSubmit}
              placeholder="Choose your name from above or enter a new name ..."
              />
          </div>
        </div>
      )
    }
  }

  clearUserTyping () {
    console.log('in clearn user typing')
    this.firebaseChannels.child(this.state.channelID).update({userTyping: ''})
    this.setState({userTyping: ''})
  }

  updateUserTyping (user) {
    console.log('in updateUserTyping: ')
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
    console.log('in setmember, member: ', member)
    this.setState({localUser: member})
  }
  renderChannelPrompt () {
    var members = this.state.chatMembers.map(function (member) {
      console.log('MEMBER: ', member)
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
    console.log('state chatlog in rendermethod: ', this.state.chatLog)
    console.log('currentMembers: ', this.state.chatMembers)
    return (
      <div className="app-container">
        <div className="app-content">
        <div className="clearChatLogButton" onClick={this.createNewChannel}>Create New Chat</div>
          {this.renderNamePrompt()}
          {this.renderUserScreen()}
        </div>
      </div>
    );
  }
};

export default App;
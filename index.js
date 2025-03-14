/**
 * @format
 */

 import {AppRegistry, LogBox} from 'react-native';
 import { Navigation } from 'react-native-navigation';
 import { App } from './src/App';
 import {name as appName} from './app.json';
 
 import PushNotification from 'react-native-push-notification';
 
 // PushNotification.createChannel(
 //   {
 //     channelId: "645873262252", // (required)
 //     channelName: "Main channel", // (required)
 //     channelDescription: "Main channel description", // (optional) default: undefined.
 //     playSound: true, // (optional) default: true
 //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
 //     importance: 5, // (optional) default: 4. Int value of the Android notification importance
 //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
 //   },
 //   (created) => console.log(`createChannel returned +++++'${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
 // );
 
 LogBox.ignoreAllLogs();
 
 App();
 
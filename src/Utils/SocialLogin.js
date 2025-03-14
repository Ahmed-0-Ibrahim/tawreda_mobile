/* eslint-disable no-shadow */
import {Platform} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export const facebookLogin = (onSuccess, onError) => {
  LoginManager.logInWithPermissions(['email']).then(
    result => {
      if (result.isCancelled) {
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const requestCallback = (error, result) => {
            if (error) {
              onError(error);
            } else {
              let newData = {
                socialId: result.id,
                name: `${result.first_name} ${result.last_name}`,
                // image: result.picture.data.url,
                socialMediaType: 'FACEBOOK',
              };
              if (result.email) {
                newData.email = result.email;
              }
              if (result.phone) {
                newData.phone = result.phone;
              }
              onSuccess(newData);
            }
          };
          const request = new GraphRequest(
            '/me',
            {
              accessToken: data.accessToken,
              parameters: {
                fields: {
                  string: 'email,first_name,last_name,picture.type(large)',
                },
              },
            },
            requestCallback,
          );
          new GraphRequestManager().addRequest(request).start();
        });
      }
    },
    error => {
      onError(error);
    },
  );
};

export const googleLogin = async (onSuccess, onError) => {
  if (Platform.OS === 'ios') {
    await GoogleSignin.configure({
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '554652321049-d1dju48d92k2iq69402s5plpg4til0r2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '1070974083078-npbga0mm381a51l2asrat3f6vannlrq9.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  } else if (Platform.OS === 'android') {
    GoogleSignin.hasPlayServices().catch();
    await GoogleSignin.configure({
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '434725947587-vumn55891t1j55j7b3b5f117n06hmjf4.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '1070974083078-npbga0mm381a51l2asrat3f6vannlrq9.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }
  var userInfo = null;
  try {
    // const user = await GoogleSignin.currentUserAsync();
    userInfo = await GoogleSignin.signIn().catch();
    // this.props.onData(userInfo.user);
    let newData = {
      socialId: userInfo.user.id,
      name: userInfo.user.name,
    //   image: userInfo.user.photo,
      socialMediaType: 'GOOGLE',
    };
    if (userInfo.user.email) {
      newData.email = userInfo.user.email;
    }
    if (userInfo.user.phone) {
      newData.phone = userInfo.user.phone;
    }
    onSuccess(newData);
  } catch (error) {
    console.log({error});
    onError(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

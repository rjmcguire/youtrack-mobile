/* @flow */
import PubSub from 'pubsub-js';
import Auth from './components/auth/auth';
import Router from './components/router/router';
import Home from './views/home/home';
import EnterServer from './views/enter-server/enter-server';
import LoginForm from './views/log-in/log-in';
import usage from './components/usage/usage';
import {setNotificationComponent} from './components/notification/notification';
import IssueList from './views/issue-list/issue-list';
import SingleIssue from './views/single-issue/single-issue';
import CreateIssue from './views/create-issue/create-issue';
import ShowImage from './views/show-image/show-image';
import AttachmentPreview from './views/attachment-preview/attachment-preview';
import AgileBoard from './views/agile-board/agile-board';
import {loadConfig, getStoredConfig} from './components/config/config';
// $FlowFixMe: cannot typecheck easy-toast module because of mistakes there
import Toast from 'react-native-easy-toast';

import {BackAndroid, Navigator, View} from 'react-native';
import React, {PropTypes, Component} from 'react';
import ActionSheet from '@exponent/react-native-action-sheet';
import type {AppConfigFilled} from './flow/AppConfig';


class YouTrackMobile extends Component {
  state: Object;
  auth: Auth;
  _actionSheetRef: Object;

  static childContextTypes = {
    actionSheet: PropTypes.func
  };

  constructor() {
    super();

    this.registerRoutes();
    this.addAndroidBackButtonSupport();
    this.getStoredUrlAndProceed();
  }

  async getStoredUrlAndProceed() {
    const storedConfig = await getStoredConfig();
    if (storedConfig) {
      return this.initialize(storedConfig);
    }
    Router.EnterServer({serverUrl: null});
  }

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef
    };
  }

  async checkAuthorization() {
    await this.auth.loadStoredAuthParams();
    return Router.IssueList({auth: this.auth});
  }

  addAndroidBackButtonSupport() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      const populated = Router.pop();
      const preventCloseApp = populated;
      return preventCloseApp;
    });
  }

  async initializeAuth(config: AppConfigFilled) {
    this.auth = new Auth(config);
    usage.init(config.statisticsEnabled);
    return await this.checkAuthorization();
  }

  async initialize(config: AppConfigFilled) {
    Router._getNavigator() && Router.Home({
      backendUrl: config.backendUrl,
      error: null,
      message: 'Connecting to YouTrack...'
    });

    try {
      await this.initializeAuth(config);
    } catch (error) {
      let reloadedConfig;
      try {
        reloadedConfig = await loadConfig(config.backendUrl);
      } catch (error) {
        return Router.Home({backendUrl: config.backendUrl, error});
      }

      try {
        await this.initializeAuth(reloadedConfig);
      } catch (e) {
        return Router.LogIn();
      }
    }
  }

  registerRoutes() {
    Router.registerRoute({
      name: 'Home',
      component: Home,
      type: 'reset',
      props: {
        message: `Loading configuration...`,
        onChangeBackendUrl: (oldUrl) => Router.EnterServer({serverUrl: oldUrl})
      }
    });

    Router.registerRoute({
      name: 'EnterServer',
      component: EnterServer,
      animation: Navigator.SceneConfigs.FloatFromLeft,
      type: 'replace',
      props: {
        connectToYoutrack: newUrl => {
          return loadConfig(newUrl)
            .then(config => {
              this.auth = new Auth(config);
              usage.init(config.statisticsEnabled);
              Router.LogIn();
            });
        }
      }
    });

    const getAuth = () => this.auth;

    Router.registerRoute({
      name: 'LogIn',
      component: LoginForm,
      props: {
        get auth() {
          return getAuth();
        },
        onLogIn: this.checkAuthorization.bind(this),
        onChangeServerUrl: youtrackUrl => Router.EnterServer({serverUrl: youtrackUrl})
      },
      type: 'reset'
    });

    Router.registerRoute({
      name: 'IssueList',
      component: IssueList,
      type: 'replace'
    });

    Router.registerRoute({name: 'SingleIssue', component: SingleIssue});

    Router.registerRoute({name: 'ShowImage', component: ShowImage, animation: Navigator.SceneConfigs.FloatFromBottom});

    Router.registerRoute({name: 'AttachmentPreview', component: AttachmentPreview, animation: Navigator.SceneConfigs.FloatFromBottom});

    Router.registerRoute({name: 'CreateIssue', component: CreateIssue});

    Router.registerRoute({name: 'AgileBoard', component: AgileBoard, type: 'replace'});
  }

  handleOrientationChange = (event: Object) => {
    const {width, height} = event.nativeEvent.layout;
    const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
    PubSub.publish('YTM_ORIENTATION_CHANGE', orientation);
  }

  render() {
    return <ActionSheet ref={component => this._actionSheetRef = component}>
      <View style={{flex: 1}} onLayout={this.handleOrientationChange}>
        {Router.renderNavigatorView({initialRoute: Router.routes.Home})}
        <Toast ref={toast => setNotificationComponent(toast)}/>
      </View>
    </ActionSheet>;
  }
}

module.exports = YouTrackMobile;

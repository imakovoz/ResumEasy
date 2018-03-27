import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/auth_route_util';
import React from 'react';
import DashboardContainer from './dashboard/dashboard_container';
import HeaderContainer from './header/header_container';
// import LoginContainer from './login/login_form_container';
// import SignupContainer from './login/signup_form_container';

const App = () => (
  <div>
    
    <Switch>
      <DashboardContainer />
    </Switch>
  </div>
);

export default App;

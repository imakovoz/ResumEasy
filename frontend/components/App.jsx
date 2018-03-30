import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/auth_route_util';
import React from 'react';
import LoginContainer from './login/login_form_container';
import SignupContainer from './login/signup_form_container';
import DashboardContainer from './dashboard/dashboard_container';
import ScrapeJobs from './jobs/scrape_jobs/scrape_jobs_container';
import FindJobs from './jobs/find_jobs/find_jobs_container';
import ApplyJobs from './jobs/apply_jobs/apply_jobs_container';
import HeaderContainer from './header/header_container';
// import LoginContainer from './login/login_form_container';
// import SignupContainer from './login/signup_form_container';

const App = () => (
  <div>
    <HeaderContainer />
    <Switch>
      <AuthRoute path="/login" component={LoginContainer} />
      <AuthRoute path="/signup" component={SignupContainer} />
      <ProtectedRoute path="/scrape-jobs" component={ScrapeJobs} />
      <ProtectedRoute path="/find-jobs" component={FindJobs} />
      <ProtectedRoute path="/apply-jobs" component={ApplyJobs} />
      <ProtectedRoute path="/" component={DashboardContainer} />
    </Switch>
  </div>
);

export default App;

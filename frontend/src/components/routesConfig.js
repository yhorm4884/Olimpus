import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import ActivityCalendar from './ActivityCalendar';
import UserActivities from './UserActivities';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import ResetPasswordPage from './ResetPasswordPage';
import ReactivateAccount from './ReactiveAccount';
import RegisterEmpresa from './RegisterCompanie';
import ChoosePlanScreen from './ChoosePlanScreen';
import CompanyManagement from './CompanyManagement';
import LinktoCompanie from './LinkToCompanie';

const ProtectedRoute = ({ component: Component, isAuthenticated, userId, requiredUserId, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated && (!requiredUserId || userId === requiredUserId) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userId: null,
    photo: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('https://backend.olimpus.arkania.es/users/check_user_authenticated/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await authResponse.json();
        if (data.isAuthenticated && data.userId) {
          setAuthState({
            isAuthenticated: true,
            userId: data.userId,
            photo: data.photo
          });
        }
      } catch (error) {
        console.error('Error fetching auth status:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/reactivate/:userId/:token" component={ReactivateAccount} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:uidb64/:token" component={ResetPasswordPage} />
        <ProtectedRoute
          path="/dashboard/user/:userId"
          component={Dashboard}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
          requiredUserId={authState.userId}
        />
        <ProtectedRoute
          path="/dashboard/profile/:userId"
          component={UserProfile}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
          requiredUserId={authState.userId}
        />
        <ProtectedRoute
          path="/dashboard/my-activities/:userId"
          component={UserActivities}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
          requiredUserId={authState.userId}
        />
        <ProtectedRoute
          path="/dashboard/activities/:companyId"
          component={ActivityCalendar}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
        />
        <ProtectedRoute
          path="/dashboard/company-management/:userId"
          component={CompanyManagement}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
          requiredUserId={authState.userId}
        />
        <Route path="/register-companie" component={RegisterEmpresa} />
        <Route path="/choose-plan/:companyId" component={ChoosePlanScreen} />
        <ProtectedRoute
          path="/dashboard/link-to-companie/:userId"
          component={LinktoCompanie}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
          requiredUserId={authState.userId}
        />
        <Route exact path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;

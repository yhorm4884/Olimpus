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
import LoadingScreen from './Cargando';
import CompanyDetails from './CompanyDetails';


const routesConfig = [
  { path: "/login", name: "Iniciar sesión", Component: Login},
  { path: "/register", name: "Registrarse", Component: Register },
  { path: "/logout", name: "Cerrar sesión", Component: Logout },
  { path: "/reactivate/:userId/:token", name: "Reactivar cuenta", Component: ReactivateAccount },
  { path: "/forgot-password", name: "Olvidé mi contraseña", Component: ForgotPassword },
  { path: "/reset-password/:uidb64/:token", name: "Restablecer contraseña", Component: ResetPasswordPage },

  { path: "/dashboard/user/:userId", name: "Dashboard", Component: Dashboard, isPrivate: true }, 
  { path: "/dashboard/profile/:userId", name: "Perfil", Component: UserProfile, isPrivate: true }, 
  { path: "/dashboard/my-activities/:userId", name: "Mis Actividades", Component: UserActivities, isPrivate: true }, 
  { path: "/dashboard/activities/:companyId", name: "Actividades", Component: ActivityCalendar, isPrivate: true },
  { path: "/dashboard/company-management/:userId", name: "Gestión de la empresa", Component: CompanyManagement, }, 

  { path: "/dashboard/company-details/:companyId", name: "Detalles Empresa", Component: CompanyDetails, }, 
  { path: "/register-companie", name: "Registrar empresa", Component: RegisterEmpresa, isPrivate: true },
  { path: "/choose-plan/:companyId", name: "Elegir plan", Component: ChoosePlanScreen, isPrivate: true }, 
  { path: "/dashboard/link-to-companie/:userId", name: "Vincular a la empresa", Component: LinktoCompanie, isPrivate: true }, 
  { path: "/cargando/:userId", name: "cargando", Component: LoadingScreen },
  { path: "/", name: "Inicio", Component: Home },
  { path: "*", name: "No encontrado", Component: NotFound },

];

export default routesConfig;
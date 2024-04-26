import Home from './Home';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import ActivityCalendar from './ActivityCalendar';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import ResetPasswordPage from './ResetPasswordPage';
import ReactivateAccount from './ReactiveAccount';
import RegisterEmpresa from './RegisterCompanie';
import ChoosePlanScreen from './ChoosePlanScreen';

const routesConfig = [
  
  { path: "/login", name: "Iniciar sesión", Component: Login },
  { path: "/register", name: "Registrarse", Component: Register },
  { path: "/logout", name: "Cerrar sesión", Component: Logout },
  { path: "/reactivate/:userId/:token", name: "Reactivar cuenta", Component: ReactivateAccount },
  { path: "/forgot-password", name: "Olvidé mi contraseña", Component: ForgotPassword },
  { path: "/reset-password/:uidb64/:token", name: "Restablecer contraseña", Component: ResetPasswordPage },
  { path: "/dashboard/user/:userId", name: "Dashboard", Component: Dashboard },
  { path: "/dashboard/profile/:userId", name: "Perfil", Component: UserProfile },
  { path: "/dashboard/activities/:companyId", name: "Actividades", Component: ActivityCalendar },
  { path: "/dashboard/company-management/:userId", name: "Gestión de la empresa", Component: Dashboard }, // Asume que este es el componente correcto
  { path: "/register-companie", name: "Registrar empresa", Component: RegisterEmpresa },
  { path: "/choose-plan/:companyId", name: "Elegir plan", Component: ChoosePlanScreen }, 
  { path: "/dashboard/link-to-companie/:userId", name: "Vincular a la empresa", Component: Dashboard }, // Asume que este es el componente correcto
  { path: "/", name: "Inicio", Component: Home },
  { path: "*", name: "No encontrado", Component: NotFound },
];

export default routesConfig;

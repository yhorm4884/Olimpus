import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import routesConfig from './routesConfig';

function BreadcrumbComponent({ authState }) {
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/').filter(x => x);

  // Comenzar con el ícono de inicio siempre visible
  const breadcrumbs = [{
    label: 'Inicio',
    to: '/',
    icon: <HomeIcon fontSize="small" />
  }];

  let pathAccumulated = '/dashboard'; // Comienza desde el nodo de dashboard

  if (pathname.includes('dashboard')) {
    const dashboardPath = `/dashboard/user/${authState.userId}`;
    breadcrumbs.push({
      label: 'Dashboard',
      to: dashboardPath,
      icon: <DashboardIcon fontSize="small" />
    });
    pathAccumulated = dashboardPath; // Continúa acumulando desde aquí
  }

  // Procesar los segmentos de ruta para manejar las subrutas correctamente
  pathSegments.forEach((segment, index) => {
    if (segment === 'dashboard' || segment === 'user' || !isNaN(Number(segment))) {
      // Ignorar 'dashboard', 'user' y cualquier número (userID)
      return;
    }

    pathAccumulated += `/${segment}`;
    if (index < pathSegments.length - 1) {
      pathAccumulated += `/${authState.userId}`;
    }

    // Verificar si la ruta construida coincide con alguna en routesConfig
    const routeMatch = routesConfig.find(route => route.path.replace(/:\w+/g, '[^/]+') === pathAccumulated);

    if (routeMatch && routeMatch.name !== 'No encontrado' && !breadcrumbs.some(b => b.to === pathAccumulated)) {
      const icon = routeMatch.name === 'Perfil' ? <PersonIcon fontSize="small" /> : null;
      breadcrumbs.push({
        label: routeMatch.name,
        to: pathAccumulated,
        icon
      });
    }
  });

  console.log("Breadcrumb path accumulation: ", pathAccumulated); // Para depuración

  // Añadir el último segmento como clickeable si no es el actual
  if (pathAccumulated !== pathname) {
    const lastRouteMatch = routesConfig.find(route => new RegExp(route.path.replace(/:\w+/g, '[^/]+')).test(pathname));
    if (lastRouteMatch && lastRouteMatch.name !== 'No encontrado') {
      breadcrumbs.push({
        label: lastRouteMatch.name,
        to: pathname
      });
    }
  }

  console.log("Final Breadcrumbs: ", breadcrumbs); // Para depuración

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ padding: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return isLast ? (
          <Typography color="textPrimary" key={index}>{breadcrumb.label}</Typography>
        ) : (
          <Link component={RouterLink} to={breadcrumb.to} key={index} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {breadcrumb.icon && <>{breadcrumb.icon}&nbsp;</>}
            <Typography color="inherit">{breadcrumb.label}</Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default BreadcrumbComponent;

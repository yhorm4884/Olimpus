import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import CompanyEdit from './CompanyEdit';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TextField, Grid, Snackbar, Typography, Button, Checkbox, IconButton, Tooltip, Paper, TableSortLabel, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, FileDownload as FileDownloadIcon, Notifications as NotificationsIcon, Close as CloseIcon } from '@mui/icons-material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import AddActivityForm from './AddActivityForm';
import EditActivityForm from './EditActivityForm';
import GestionUsuarios from './GestionUsuarios';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/notifications/list/${userId}/`)
      .then(response => {
        setNotifications(response.data);
      });
  }, [userId]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateNotification = (action) => {
    axios.post(`http://127.0.0.1:8000/notifications/update/${selectedNotification.id}/`, { action })
      .then(response => {
        setSnackbar({ open: true, message: response.data.message });
        handleCloseDialog();
        setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
      })
      .catch(error => {
        setSnackbar({ open: true, message: 'Error processing notification' });
        console.error('Error processing notification:', error);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  
  return (
    <div style={{ maxWidth: '360px' }}>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Notificaciones</Typography>
      <List sx={{ bgcolor: 'background.paper' }}>
        {notifications.map(notification => (
          <ListItem key={notification.id} button onClick={() => handleNotificationClick(notification)} sx={{ bgcolor: 'white', mb: 1, boxShadow: 1 }}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${notification.usuario_cliente} solicita unirse a ${notification.actividad_nombre}`}
              secondary={`Estado: ${notification.estado}`}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Detalles de la Notificación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedNotification ? `${selectedNotification.usuario_cliente} ha solicitado unirse a la actividad '${selectedNotification.actividad_nombre}' creada el ${selectedNotification.fecha_creacion}. Estado: ${selectedNotification.estado}` : 'Cargando...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUpdateNotification('aceptar')} color="primary">Aceptar</Button>
          <Button onClick={() => handleUpdateNotification('rechazar')} color="secondary">Rechazar</Button>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};


const ActivityList = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formMode, setFormMode] = useState(null); // 'add', 'edit' o null
  const [currentActivity, setCurrentActivity] = useState(null);
  const [error, setError] = useState(false);
  const [empresas, setEmpresas] = useState([]);
 
  const fetchActivities = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/activities/actividades/${userId}`);
      const formattedActivities = response.data.map(activity => ({
        ...activity,
        formattedEntranceTime: format(new Date(activity.hora_entrada), 'dd/MM/yyyy HH:mm'),
        formattedExitTime: format(new Date(activity.hora_salida), 'dd/MM/yyyy HH:mm')
      }));
      setActivities(formattedActivities);
      setFilteredActivities(formattedActivities);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = activities.filter(activity => activity.nombre.toLowerCase().includes(value.toLowerCase()));
    setFilteredActivities(filtered);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    sortData(property, isAsc ? 'desc' : 'asc');
  };

  const sortData = (property, direction) => {
    const sortedData = filteredActivities.sort((a, b) => {
      if (property === 'id') {
        return direction === 'asc' ? a.id - b.id : b.id - a.id;
      } else {
        return direction === 'asc' ? a[property].localeCompare(b[property]) : b[property].localeCompare(a[property]);
      }
    });
    setFilteredActivities([...sortedData]);
  };

  const handleSelectActivity = (event, id) => {
    const selectedIndex = selectedActivities.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedActivities, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedActivities.slice(1));
    } else if (selectedIndex === selectedActivities.length - 1) {
      newSelected = newSelected.concat(selectedActivities.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedActivities.slice(0, selectedIndex),
        selectedActivities.slice(selectedIndex + 1)
      );
    }

    setSelectedActivities(newSelected);
  };

  const isSelected = (id) => selectedActivities.includes(id);

  const handleAddActivityClick = () => {
    setFormMode('add');
    setCurrentActivity(null);
    console.log("entro en añadir")
  };

  const handleEditClick = (activity) => {
    setCurrentActivity(activity);
    setFormMode('edit');
    console.log("entro en editar")
  };

  const handleFormClose = () => {
    setFormMode(null);
    fetchActivities();
  };

  const handleSaveActivity = async ({ activityData, userId, isEdit = false }) => {
    const endpoint = isEdit
      ? `http://127.0.0.1:8000/activities/edit_actividad/${currentActivity.id}/`
      : `http://127.0.0.1:8000/activities/add_actividad/${userId}/`;

    try {
      console.log("Endpoint:", endpoint, "Data:", activityData);
      const response = await axios.post(endpoint, activityData);
      alert(response.data.message);
      handleFormClose();
      fetchActivities();
    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      alert('Error al guardar la actividad');
    }
  };

  // Exportar a csv
  const exportToCSV = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const formattedData = filteredActivities.map(activity => {
        // Parse y validación de las fechas
        const entradaDate = activity.hora_entrada ? parseISO(activity.hora_entrada) : null;
        const salidaDate = activity.hora_salida ? parseISO(activity.hora_salida) : null;

        return {
            ...activity,
            dia_entrada: entradaDate && isValid(entradaDate) ? format(entradaDate, 'yyyy-MM-dd') : 'Fecha no válida',
            hora_entrada: entradaDate && isValid(entradaDate) ? format(entradaDate, 'HH:mm:ss') : 'Hora no válida',
            dia_salida: salidaDate && isValid(salidaDate) ? format(salidaDate, 'yyyy-MM-dd') : 'Fecha no válida',
            hora_salida: salidaDate && isValid(salidaDate) ? format(salidaDate, 'HH:mm:ss') : 'Hora no válida',
        };
    }).map(({ formattedEntranceTime, formattedExitTime, fecha_creacion, ...keepAttrs }) => keepAttrs);

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'activities.xlsx');
};

  // Eliminar

  const handleDeleteSelected = () => {
    if (selectedActivities.length > 0) {
      axios.post(`http://127.0.0.1:8000/activities/delete/`, { ids: selectedActivities })
        .then(response => {
          alert('Actividades eliminadas con éxito.');
          // Actualizar las actividades mostradas tras eliminar
          const updatedActivities = filteredActivities.filter(activity => !selectedActivities.includes(activity.id));
          setActivities(updatedActivities);
          setFilteredActivities(updatedActivities);
          setSelectedActivities([]);  // Limpiar selecciones
        })
        .catch(error => {
          console.error('Error al eliminar actividades:', error);
          alert('Error al eliminar actividades.');
        });
    } else {
      alert('No se han seleccionado actividades para eliminar.');
    }
  };
  const handleDeleteActivity = async (activityId) => {
    try {
        const response = await axios.post(`http://127.0.0.1:8000/activities/delete_single/`, { id: activityId });
        alert(response.data.message);
        // Refresca la lista tras eliminar
        fetchActivities();
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        alert('Error al eliminar la actividad');
    }
  };

  const fetchEmpresas = () => {
    axios.get('http://127.0.0.1:8000/api/empresas/')
      .then(response => {
        // Filtrar para obtener empresas donde el usuario actual es propietario
        const empresasPropietario = response.data.filter(empresa =>
          empresa.usuarios.some(usuario => usuario.id === parseInt(userId) && usuario.tipo_usuario === 'propietario')
        );
        setEmpresas(empresasPropietario);
      })
      .catch(error => {
        console.error('Error fetching empresas:', error);
        setError(true);
      });
  };

  useEffect(() => {
    fetchActivities();
    fetchEmpresas();

  }, [userId]);

  return (
    <div style={{ flex: 1, overflow: 'auto', marginLeft: '20px' }}>
      {formMode === 'add' && (
        <AddActivityForm
          userId={userId}
          onSave={(userId, activityData) => handleSaveActivity(userId, activityData)}
          onClose={() => setFormMode(null)}
        />
      )}
      {formMode === 'edit' && currentActivity && (
        <EditActivityForm
          activity={currentActivity}
          onSave={(activityData) => handleSaveActivity(activityData, true)}
          onClose={handleFormClose}
        />
      )}


      <TextField
        label="Buscar Actividad"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddActivityClick}
        style={{ marginBottom: 10 }}
      >
        Crear Actividad
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        onClick={handleDeleteSelected}
        disabled={selectedActivities.length === 0}
        style={{ marginRight: 10 }}
      >
        Eliminar Seleccionado 
      </Button>

      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={exportToCSV}
        style={{ backgroundColor: '#2196f3', color: 'white' }}
      >
        Exportar a CSV
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedActivities.length > 0 && selectedActivities.length < filteredActivities.length}
                  checked={filteredActivities.length > 0 && selectedActivities.length === filteredActivities.length}
                  onChange={(event) => setSelectedActivities(event.target.checked ? filteredActivities.map(n => n.id) : [])}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'lugar'}
                  direction={orderBy === 'lugar' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'lugar')}
                >
                  Lugar
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activity) => (
              <TableRow
                key={activity.id}
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(activity.id)}
                    onChange={(event) => handleSelectActivity(event, activity.id)}
                  />
                </TableCell>
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.nombre}</TableCell>
                <TableCell>{activity.lugar}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEditClick(activity)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDeleteActivity(activity.id)}>
                          <DeleteIcon />
                      </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredActivities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </TableContainer>
      {empresas.map((empresa) => (
      <Grid item xs={12} md={8} lg={9} key={empresa.id_empresa}>
        <Typography variant="h6">Gestión de Usuarios - {empresa.nombre}</Typography>
        <GestionUsuarios idEmpresa={empresa.id_empresa} />
      </Grid>
    ))}
    </div>
    
  );

};

const CompanyManagement = () => {
  const { userId } = useParams();

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', paddingTop: '50px', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <CompanyEdit userId={userId} />
          <Notifications userId={userId} />
        </div>
        <div style={{ flex: 3 }}>
          <ActivityList userId={userId} />
          
        </div>
      </div>
    </div>
  );
};


export default CompanyManagement;

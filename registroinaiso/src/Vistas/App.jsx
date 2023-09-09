import React, { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import { useEffect } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const App = () =>{
  const [Users, setUsers] = useState([]);
  const [Reporte, setReportes] = useState([]);
  const[ActiveTable, setActiveTable] = useState(0)
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState(null);


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    id: "",
    name: "",
  });

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    // Realiza la solicitud GET para obtener los datos de usuarios
    axios.get("http://localhost:5104/api/Users")
      .then((response) => {
        // Actualiza el estado con los datos recibidos
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de usuarios:", error);
      });
  }, []);

  const handleAddUser = () => {
    // Realiza la solicitud POST para agregar el usuario
    axios
      .post("http://localhost:5104/api/Users", newUserData)
      .then((response) => {
        // Actualiza la lista de usuarios con el nuevo usuario
        setUsers((prevUsers) => [...prevUsers, response.data]);
        // Cierra el diálogo
        handleDialogClose();
        // Limpia los datos del nuevo usuario
        setNewUserData({
          name: "",
          // Limpia otros campos si es necesario
        });
      })
      .catch((error) => {
        console.error("Error al agregar el usuario:", error);
      });
  };

  const handleDeleteDialogClose = () => {
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  const confirmDeleteUser = () => {
    // Realiza la solicitud DELETE para eliminar el usuario
    axios
      .delete(`http://localhost:5104/api/Users/${userToDelete.id}`)
      .then(() => {
        // Elimina el usuario de la lista de usuarios
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
        // Cierra el cuadro de diálogo de confirmación
        handleDeleteDialogClose();
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
        // Cierra el cuadro de diálogo de confirmación en caso de error
        handleDeleteDialogClose();
      });
  };

  const handleReportDialogOpen = (userId) => {
    setIsReportDialogOpen(true);
  
    // Realiza la solicitud al backend para obtener el reporte del usuario
    axios
      .get(`http://localhost:5104/api/UserReservations/${userId}`)
      .then((response) => {
        // Actualiza el estado con los datos del reporte
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el reporte del usuario:", error);
      });
  };

  

  return (
    <div style={{ textAlign: "center", margin: "20px auto", maxWidth: "800px" }}>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
              
              {/* Agrega más encabezados de columna según tus datos */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell><Button variant="contained" style={{ marginRight: "10px" }} >
                      Editar
                    </Button>
                    <Button
                        variant="contained"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          setUserToDelete(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="contained"
                        style={{ marginRight: "10px" }}
                        onClick={() => handleReportDialogOpen(user.id)}
                      >
                        Reporte
                      </Button>
                    </TableCell>
                  
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="contained" style={{ marginRight: "10px" }} onClick={handleDialogOpen}>
              Agregar Usuario
            </Button>
          </div>
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Agregar Usuario</DialogTitle>
      <DialogContent>
      <TextField
        label="ID"
        name="id"
        value={newUserData.id}
        onChange={handleNewUserChange}
        fullWidth
      />

      <TextField
        label="Nombre"
        name="name"
        value={newUserData.name}
        onChange={handleNewUserChange}
        fullWidth
        style={{ marginTop: '20px' }}
      />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancelar</Button>
        <Button onClick={handleAddUser}>Guardar</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <p>¿Estás seguro de que deseas eliminar a {userToDelete && userToDelete.name}?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
        <Button onClick={confirmDeleteUser}>Eliminar</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={isReportDialogOpen} onClose={() => setIsReportDialogOpen(false)}>
      <DialogTitle>Reporte del Usuario</DialogTitle>
      <DialogContent>
        {reportData ? (
          <div>
            <p>Nombre del Usuario: {reportData.userName}</p>
            <p>Reservaciones del Último Mes: {reportData.reservationsLastMonth}</p>
            <p>Reservaciones del Último Año: {reportData.reservationsLastYear}</p>
          </div>
        ) : (
          <p>Cargando datos del reporte...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsReportDialogOpen(false)}>Cerrar</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default App;

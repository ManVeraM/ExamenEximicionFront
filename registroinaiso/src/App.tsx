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
  const [Users, setUsers] = useState<{ id: number; name: string; }[]>([]);
  const [Apps, setApps] = useState([]);
  const [Reservations, setReservations] = useState([]);

  
  useEffect(() => {
    // Realiza la solicitud GET para obtener los datos de usuarios
    axios.get("http://localhost:5251/api/Users")
      .then((response) => {
        // Actualiza el estado con los datos recibidos
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de usuarios:", error);
      });
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              
              {/* Agrega más encabezados de columna según tus datos */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                {/* Agrega más celdas de datos según tus datos */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;

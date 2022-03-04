import React, {useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { Interface } from "readline";

import api from "../../services/api";

import './index.css'

interface IDoctor{
  ID:string
  NOME: string;
  CRM: number;
  TELFIXO:number;
  TELCELULAR:number;
  BAIRRO:string;
  UF:string;
  LOCALIDADE:string;
}


 

const Doctors: React.FC = () => {

  var num = 0;

    const [doctors,setDoctors] = useState<IDoctor[]>([]);
    const history = useHistory()

    useEffect(()=>{
        loadDoctors();
    },[])

    
    async function loadDoctors(){
        const response = await api.get('/InfoDoctorsSpecialties/')

        setDoctors(response.data);
    }

    function newDoctor(){
      history.push('/doctors_register')
    }

    function EditDoctor(){
      history.push('/doctors_register')
    }


  return (
    <div className="container">
      <br />
      <div className="Header-doctors">
      <h1>Medicos</h1>
      <Button variant="dark" size="sm" onClick={newDoctor}>Novo Medico</Button>

      </div>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CRM</th>
            <th>Tel. Celular</th>
            <th>Tel. Fixo</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
             
            doctors.map(doctor =>(
              <tr key={num ++}>
              <td>{doctor.NOME}</td>
              <td>{doctor.CRM}</td>
              <td>{doctor.TELCELULAR}</td>
              <td>{doctor.TELFIXO}</td>
              <td>{doctor.BAIRRO}</td>
              <td>{doctor.LOCALIDADE}</td>
              <td>{doctor.UF}</td>
              <td>
                <Button size='sm' variant="warning">Editar</Button>{' '}
                <Button size='sm' variant="success">Visualizar</Button>{' '}
                <Button size='sm' variant="danger">Remover</Button>{' '}
              </td>
            </tr>
            ))

          }
         
        </tbody>
      </Table>
    </div>
  );
};

export default Doctors;

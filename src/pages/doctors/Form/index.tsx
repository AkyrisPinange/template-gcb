import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";

import api from "../../../services/api";

import "./index.css";

interface IDoctor {
  ID: string;
  NOME: string;
  CRM: number;
  TELFIXO: number;
  TELCELULAR: number;
  BAIRRO: string;
  UF: string;
  LOCALIDADE: string;
}

interface IAdress {
  cepForm: string;
  logradouro: String;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface Icep {
  cep: string;
}

const listSpecialties = [
  "Alergologia",
  "Angiologia",
  "Buco maxilo",
  "Cardiologia clínca",
  "Cardiologia infantil",
  "Cirurgia cabeça e pescoço",
  "Cirurgia cardíaca",
  "Cirurgia de tórax",
];

//dados para o dropdowns
const SpecialtiesOptions = [
  { value: "Alergologia", label: "Alergologia" },
  { value: "Angiologia", label: "Angiologia" },
  { value: "Buco maxilo", label: "Buco maxilo" },
  { value: "Cardiologia clínca", label: "Cardiologia clínca" },
  { value: "Cardiologia infantil", label: "Cardiologia infantil" },
  { value: "Cirurgia cabeça e pescoço", label: "Cirurgia cabeça e pescoço" },
  { value: "Cirurgia cardíaca", label: "Cirurgia cardíaca" },
  { value: "Cirurgia de tórax", label: "Cirurgia de tórax" },
];

const Doctors: React.FC = () => {
  var SpecialtiesSelect;
  useEffect(() => {
    loadSpecialties();
  });

  const history = useHistory();
  const [cep, setCep] = useState<Icep>({
    cep: "",
  });

  const [adress, setAdress] = useState<IAdress>({
    cepForm: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
  });

  //cadastra especialidades no banco se não existirem
  async function loadSpecialties() {
    const getSpecialties = await api.get("/Specialties");

    if (getSpecialties.data.length == 0) {
      listSpecialties.forEach((index) => {
        registerSpecialties(index);
      });
    }

    SpecialtiesSelect = getSpecialties.data;
  }

  async function registerSpecialties(specialties: string) {
    const responseSpecialties = await api.post("Specialties", {
      name: specialties,
    });
  }

  //funcao responsavel por consultar o cep
  async function GetCep(this: any, e: ChangeEvent<HTMLInputElement>) {
    setCep({
      ...cep, //garante que o input só recebera numeros
      [e.target.name]: e.target.value.replace(/\D/g, '')
    });
      let lengthCep = e.target.value.replace(/\D/g, '').length
      let cepNumber = e.target.value.replace(/\D/g, '')
    //valida se o usuario digitou os 8 digitos cep para poder fazer a requisicao

    if (lengthCep == 8) {
      const resp = await api.post("/CEP/" + cepNumber + "");
      console.log(resp)
      setAdress({
        cepForm: resp.data.cep,
        logradouro: resp.data.logradourom,
        complemento: resp.data.complemento,
        bairro: resp.data.bairro,
        localidade: resp.data.localidade,
        uf: resp.data.uf,
      });
    }
  }

  function Back() {
    history.goBack();
  }

  const [model, setModel] = useState<IDoctor>({
    ID: "",
    NOME: "",
    CRM: 0,
    TELFIXO: 0,
    TELCELULAR: 0,
    BAIRRO: "",
    UF: "",
    LOCALIDADE: "",
  });

  return (
    <div className="container">
      <br />
      <div className="Header-doctors">
        <h1>Cadastro</h1>
        <Button variant="dark" size="sm" onClick={Back}>
          Voltar
        </Button>
      </div>
      <br />
      <div className="container">
        <Form>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control />
          </Form.Group>
          <br />
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Tel. Celular</Form.Label>
                <Form.Control placeholder="(81)88888-8888" />
              </Col>
              <Col>
                <Form.Label>Tel. Fixo</Form.Label>
                <Form.Control placeholder="(81)88888-8888" />
              </Col>
            </Row>
            <br />
            <Form.Label>Especialidades</Form.Label>
            <Select
              isMulti
              name="name"
              options={SpecialtiesOptions}
              className="basic-multi-select"
              classNamePrefix="Selecione"
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>CEP</Form.Label>
                <Form.Control
                  type="text"
                  name="cep"
                  maxLength={8}
                  placeholder="Digite o CEP"
                  value={cep.cep}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => GetCep(e)}
                />
              </Col>
              <Col>
                <Form.Label>Tel. Fixo</Form.Label>
                <Form.Control placeholder="" />
              </Col>
              <Col>
                <Form.Label>Tel. Fixo</Form.Label>
                <Form.Control placeholder="" />
              </Col>
            </Row>
          </Form.Group>
          <br />
          <Button variant="dark" type="submit">
            Salvar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Doctors;

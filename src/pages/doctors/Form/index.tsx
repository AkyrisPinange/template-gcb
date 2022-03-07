import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Button, Form, Col, Row, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import InputMask from "react-input-mask";

import * as Yup from "yup";

import api from "../../../services/api";

import "./index.css";

var SpecialtiesSelect: any;
var Specialties;
//inferces para facilitar a manipulação dos dados
interface IDoctor {
  id: string;
  nome: string;
  crm: number;
  telFixo: number;
  telCelular: number;
}

type OptionType = {
  value: string;
  label: string;
};
interface ISpecialtiesDoctor {
  id_doctor: string;
  id_specialties: string;
}

interface IAdress {
  id: string;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  id_doctor: string;
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
const SpecialtiesOptions: OptionType[] = [
  { value: "Alergologia", label: "Alergologia" },
  { value: "Angiologia", label: "Angiologia" },
  { value: "Buco maxilo", label: "Buco maxilo" },
  { value: "Cardiologia clínca", label: "Cardiologia clínca" },
  { value: "Cardiologia infantil", label: "Cardiologia infantil" },
  { value: "Cirurgia cabeça e pescoço", label: "Cirurgia cabeça e pescoço" },
  { value: "Cirurgia cardíaca", label: "Cirurgia cardíaca" },
  { value: "Cirurgia de tórax", label: "Cirurgia de tórax" },
];

//REACT
const Doctors: React.FC = () => {
  useEffect(() => {
    loadSpecialties();
  });

  const history = useHistory();

  //useState
  const [cep, setCep] = useState<Icep>({
    cep: "",
  });

  const [specialtiesDoctor, setSpecialtiesDoctor] =
    useState<ISpecialtiesDoctor>({
      id_doctor: "",
      id_specialties: "",
    });

  const [adress, setAdress] = useState<IAdress>({
    id: "",
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    id_doctor: "",
    uf: "",
  });

  const [doctor, setDoctor] = useState<IDoctor>({
    id: "",
    nome: "",
    crm: 0,
    telFixo: 0,
    telCelular: 0,
  });

  //cadastra especialidades no banco se não existirem
  async function loadSpecialties() {
    const getSpecialties = await api.get("/Specialties");

    if (getSpecialties.data.length == 0) {
      listSpecialties.forEach((index) => {
        registerSpecialties(index);
      });
    }

    // SpecialtiesSelect = getSpecialties.data;
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
      [e.target.name]: e.target.value.replace(/\D/g, ""),
    });
    let lengthCep = e.target.value.replace(/\D/g, "").length;
    let cepNumber = e.target.value.replace(/\D/g, "");

    //valida se o usuario digitou os 8 digitos cep para poder fazer a requisicao
    if (lengthCep == 8) {
      const resp = await api.post("/CEP/" + cepNumber + "");

      setAdress({
        id: "",
        cep: resp.data.cep == undefined ? "" : resp.data.cep,
        logradouro:
          resp.data.logradouro == undefined ? "" : resp.data.logradouro,
        complemento:
          resp.data.complemento == undefined ? "" : resp.data.complemento,
        bairro: resp.data.bairro == undefined ? "" : resp.data.bairro,
        localidade:
          resp.data.localidade == undefined ? "" : resp.data.localidade,
        uf: resp.data.uf == undefined ? "" : resp.data.uf,
        id_doctor: "",
      });
    }
  }

  function UpdatedSpecialties(e: any) {
    SpecialtiesSelect = e;
  }
  function UpdatedDoctor(e: ChangeEvent<HTMLInputElement>) {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  }
  function UpdatedAdress(e: ChangeEvent<HTMLInputElement>) {
    setAdress({
      ...adress,
      [e.target.name]: e.target.value,
    });
  }

  async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    let numberCel = doctor.telCelular
      .toString()
      .replaceAll("(", "")
      .replace(")", "")
      .replace("-", "");
    let numberFix = doctor.telFixo
      .toString()
      .replace("(", "")
      .replace(")", "")
      .replace("-", "");

    doctor.telCelular = parseInt(numberCel);
    doctor.telFixo = parseInt(numberFix);

    const respDoctor = await api.post("/InfoDoctors", doctor);
    // console.log(respDoctor);
    adress.id_doctor = respDoctor.data.id;
    const respAdress = await api.post("/Adress", adress);
    console.log(respAdress);

    var arraySpecialties: any[] = [];
    const respSpecialties = await api.get("/Specialties");

    console.log(SpecialtiesSelect);
    SpecialtiesSelect.forEach((index: any) => {
      arraySpecialties.push(
        respSpecialties.data.filter(
          (s: { name: string }) => s.name === index.value
        )
      );
    });

    await Promise.all(
      arraySpecialties.map(async (elem) => {
       
        let id_specialties = elem[0].id;
        let id_doctor = respDoctor.data.id;
      
       

        const respSpecialtiesDoctor = await api.post(
          "/InfoDoctorsSpecialties",
          {
            id_specialties: id_specialties,
            id_doctor: id_doctor,
          }
        );
        
      })
    );
  }


 

  function Back() {
    history.goBack();
  }

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
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              maxLength={120}
              type="text"
              name="nome"
              onChange={(e: ChangeEvent<HTMLInputElement>) => UpdatedDoctor(e)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Tel. Celular</Form.Label>
                <InputMask
                  placeholder="(81)88888-8888"
                  className="phone"
                  name="telCelular"
                  mask="(99)999999-9999"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedDoctor(e)
                  }
                />
              </Col>
              <Col>
                <Form.Label>Tel. Fixo</Form.Label>
                <InputMask
                  placeholder="(81)88888-8888"
                  className="phone"
                  name="telFixo"
                  mask="(99)999999-9999"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedDoctor(e)
                  }
                />
              </Col>
              <Col>
                <Form.Label>CRM</Form.Label>
                <Form.Control
                  maxLength={7}
                  type="text"
                  name="crm"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedDoctor(e)
                  }
                />
              </Col>
            </Row>
            <br />
            <Form.Label>Especialidades</Form.Label>
            <Select
              isMulti
              name="specialties"
              options={SpecialtiesOptions}
              className="basic-multi-select"
              classNamePrefix="Selecione"
              placeholder="Selecione"
              onChange={(e: any) => UpdatedSpecialties(e)}
            />
          </Form.Group>
          <br />
          <h3>Cadastro de Endereço</h3>

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
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  placeholder=""
                  type="text"
                  name="localidade"
                  value={adress.localidade}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedAdress(e)
                  }
                />
              </Col>
              <Col>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  placeholder=""
                  type="text"
                  name="uf"
                  value={adress.uf}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedAdress(e)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Logradouro</Form.Label>
                <Form.Control
                  placeholder=""
                  type="text"
                  name="logradouro"
                  value={adress.logradouro}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedAdress(e)
                  }
                />
              </Col>
              <Col>
                <Form.Label>Bairro</Form.Label>
                <Form.Control
                  placeholder=""
                  type="text"
                  name="bairro"
                  value={adress.bairro}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedAdress(e)
                  }
                />
              </Col>
              <Col>
                <Form.Label>Complemento</Form.Label>
                <Form.Control
                  placeholder=""
                  type="text"
                  name="complemento"
                  value={adress.complemento}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    UpdatedAdress(e)
                  }
                />
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

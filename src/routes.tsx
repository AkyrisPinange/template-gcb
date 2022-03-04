import React from "react";

import { Route, Switch } from 'react-router-dom';

import Home from "./pages/home"
import Doctors from "./pages/doctors";
import DoctorsForm from "./pages/doctors/Form";

const Routes: React.FC = () => {
  return (
    <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/doctors" exact component={Doctors}/>
        <Route path="/doctors_register" exact component={DoctorsForm}/>
    </Switch>
  );
};

export default Routes;

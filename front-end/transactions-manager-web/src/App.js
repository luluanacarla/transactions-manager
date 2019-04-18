import React from "react";
import { HashRouter, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import AppRoute from "./components/AppRoute/AppRoute";
import indexRoutes from "./routes/index";

library.add(fas);

const App = () => (

        <HashRouter>
          <Switch>
            {indexRoutes.map(route => (
              <AppRoute key={route.name} {...route} />
            ))}
          </Switch>
        </HashRouter>
);

export default App;

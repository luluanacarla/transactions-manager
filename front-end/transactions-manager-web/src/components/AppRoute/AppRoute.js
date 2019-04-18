import React from "react";
import { Route, Redirect } from "react-router-dom";

const AppRoute = ({ component: Component, layout: Layout, ...routeProps }) => {
  if (routeProps.redirect) {
    return <Redirect from={routeProps.path} to={routeProps.to} />;
  }
  return (
    <Route
      {...routeProps}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default AppRoute;

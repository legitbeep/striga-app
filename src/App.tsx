import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "lib/layout";
import Routings from "lib/router/Routings";
import { theme } from "lib/styles/theme";
import UserContextProvider from "lib/context/UserContext";

const App = () => (
  <ChakraProvider theme={theme}>
    <ToastContainer />
    <UserContextProvider>
      <Router>
        <Layout>
          <Routings />
        </Layout>
      </Router>
    </UserContextProvider>
  </ChakraProvider>
);

export default App;

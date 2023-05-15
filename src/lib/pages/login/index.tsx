import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import useFetch from "lib/utils/hooks/useFetch";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "lib/utils/hooks/useMutation";
import {
  KEYS,
  generateRandomIp,
  isSuccess,
  notify,
  setItemInStorage,
} from "lib/utils";

const Login = () => {
  const { mutate } = useMutation<any>("/user/login");
  const navigate = useNavigate();
  const initValues = {
    email: "",
    password: "",
    ip: generateRandomIp(),
  };

  const handleSubmit = async (values: typeof initValues) => {
    try {
      const response = await mutate(values);
      // console.log({ response });
      if (isSuccess(response)) {
        notify("Logged In!", "success");
        setItemInStorage(KEYS.tokenStorage, {
          ...response?.data,
          expiration: new Date().getTime() + 30 * 60000,
        });
        navigate("/home");
      }
    } catch (err: any) {
      console.log({ err });
      const { message } = err?.response?.data;
      notify(message ?? "Failed to login!", "error");
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    onSubmit: handleSubmit,
  });

  return (
    <Grid gap={4}>
      <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Welcome to striga-demo
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Login to continue.
        </Text>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} align="flex-start">
          <FormControl>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FormControl>
          <Button type="submit" colorScheme="green" width="full">
            Login
          </Button>
        </VStack>
      </form>
      <Flex gap="4px">
        <Text color={"gray.500"} fontSize="sm">
          Already have an account ?{" "}
        </Text>
        <NavLink to="/signup">
          <Text color={"blue.500"} fontSize="sm">
            Sign Up
          </Text>
        </NavLink>
      </Flex>
    </Grid>
  );
};

export default Login;

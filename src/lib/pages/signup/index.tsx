import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import useFetch from "lib/utils/hooks/useFetch";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import { useEffect } from "react";
import {
  KEYS,
  generateRandomIp,
  isSuccess,
  notify,
  setItemInStorage,
} from "lib/utils";
import { useMutation } from "lib/utils/hooks/useMutation";

const signupSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  mobileCountryCode: Yup.string().required("Required"),
  mobileNumber: Yup.string().required("Required"),
  dateOfBirth: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const Signup = () => {
  const randomIp = generateRandomIp();
  const { mutate } = useMutation<any>("/user");
  const initValues = {
    email: "",
    firstName: "",
    lastName: "",
    mobileCountryCode: "+372",
    mobileNumber: "",
    dateOfBirth: "",
    password: "",
    occupation: "PUBLIC_SECTOR_ADMINISTRATION",
    sourceOfFunds: "DIVIDENDS",
    ipAddress: randomIp,
    expectedIncomingTxVolumeYearly: "BETWEEN_10000_AND_15000_EUR",
    expectedOutgoingTxVolumeYearly: "BETWEEN_10000_AND_15000_EUR",
    selfPepDeclaration: false,
    purposeOfAccount: "CARD_INSIDE_EEA",
    firebaseToken: {
      token: "some firebase token",
      deviceId: "some device id",
    },
  };

  const handleSubmit = async (values: typeof initValues) => {
    try {
      const { mobileCountryCode, mobileNumber, dateOfBirth, ...rest } = values;
      const dob = new Date(dateOfBirth);
      const formatValues = {
        ...rest,
        mobile: {
          countryCode: mobileCountryCode,
          number: mobileNumber.toString(),
        },
        dateOfBirth: {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate(),
        },
      };
      const response = await mutate(formatValues);
      console.log({ response });
      if (isSuccess(response)) {
        notify("User created successfully!", "success");
        setItemInStorage(KEYS.tokenStorage, {
          token: response?.data.token,
          refreshToken: response?.data.refreshToken,
          expiration: new Date().getTime() + 30 * 60000,
          user: {
            email: values.email,
          },
        });
      }
    } catch (err) {
      console.log({ err });
      notify("User creation failed!", "error");
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: signupSchema,
    onSubmit: handleSubmit,
  });

  console.log(formik.errors);

  return (
    <Grid gap={4}>
      <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Welcome to striga-demo
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Register new account.
        </Text>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} align="flex-start">
          <HStack spacing={4} width="100%">
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
            </FormControl>
            {formik.errors.firstName && (
              <FormErrorMessage color="red.500">
                {formik.errors.firstName}
              </FormErrorMessage>
            )}
            <FormControl>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
              )}
            </FormControl>
          </HStack>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
            <Grid templateColumns="80px 1fr" gap={6}>
              <Input
                id="mobileCountryCode"
                name="mobileCountryCode"
                type="string"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.mobileCountryCode}
              />
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="number"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.mobileNumber}
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                <FormErrorMessage>
                  {formik.errors.mobileNumber}
                </FormErrorMessage>
              )}
            </Grid>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="number"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.dateOfBirth}
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <FormErrorMessage>{formik.errors.dateOfBirth}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme="green"
            width="full"
            sx={{
              cursor:
                Object.keys(formik.errors).length > 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Login
          </Button>
        </VStack>
      </form>
      <Flex gap="4px">
        <Text color={"gray.500"} fontSize="sm">
          Already have an account ?{" "}
        </Text>
        <NavLink to="/">
          <Text color={"blue.500"} fontSize="sm">
            Signin
          </Text>
        </NavLink>
      </Flex>
    </Grid>
  );
};

export default Signup;

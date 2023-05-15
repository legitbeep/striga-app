import {
  Box,
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
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useContext, useEffect, useState, useTransition } from "react";
import {
  KEYS,
  generateRandomIp,
  getDateStr,
  getItemInStorage,
  isSuccess,
  notify,
  setItemInStorage,
} from "lib/utils";
import { useMutation } from "lib/utils/hooks/useMutation";
import { User, UserContext } from "lib/context/UserContext";

const signupSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
});

export enum KYC_STATUS {
  NOT_STARTED = "NOT_STARTED",
  INITIATED = "INITIATED",
  APPROVED = "APPROVED",
}

const Signup = () => {
  const { user, setUser } = useContext(UserContext);
  const [tokenData, setTokenData] = useState(
    getItemInStorage(KEYS.tokenStorage)
  );

  const { mutate: mutateSimulateKyc } = useMutation("/simulate/kyc");
  const { mutate: mutateStartKyc } = useMutation("/user/kyc/start");
  const { mutate: mutateEmailVerify } = useMutation("/user/verify-email");
  const { mutate: mutatePhoneVerify } = useMutation("/user/verify-mobile");
  const { mutate: mutateUser } = useMutation("/user", "patch");

  const { lazyFetch, loading } = useFetch<User>(
    "/user",
    "get",
    {},
    {
      lazy: true,
    }
  );

  useEffect(() => {
    if (tokenData && tokenData?.token) initFetch();
  }, [tokenData]);

  const initFetch = async () => {
    try {
      const res = await lazyFetch(
        {},
        {
          headers: {
            "x-authorization": tokenData?.token,
          },
        }
      );
      setUser(res?.data);
    } catch (err) {
      notify("Failed to fetch user!", "error");
    }
  };

  const onEmailVerify = async () => {
    try {
      const resposne = await mutateEmailVerify({
        verificationId: "123456",
      });
      notify("Email verified!", "success");
      initFetch();
    } catch (err) {
      console.log("Failed to verify email!", err);
      notify("Failed to verify email!", "error");
    }
  };
  const onPhoneVerify = async () => {
    try {
      const resposne = await mutatePhoneVerify({
        verificationCode: "123456",
      });
      notify("Mobile verified!", "success");
      initFetch();
    } catch (err) {
      console.log("Failed to verify Mobile!", err);
      notify("Failed to verify Mobile!", "error");
    }
  };

  const onStartKyc = async () => {
    try {
      const resposne = await mutateStartKyc();
      notify("KYC started successfully!", "success");
      initFetch();
    } catch (err) {
      console.log("Failed to start KYC", err);
      notify("Failed to start KYC!", "error");
    }
  };

  const onSimulateKyc = async () => {
    try {
      const resposne = await mutateSimulateKyc({
        userId: user?.userId,
        status: KYC_STATUS.APPROVED,
      });
      notify("KYC Approved!", "success");
      initFetch();
    } catch (err) {
      console.log("Failed KYC simulation", err);
      notify("Failed to start KYC!", "error");
    }
  };

  const handleUserUpdate = async (values: User | {}) => {
    try {
      if (Object.keys(values).length === 0) throw new Error();
      const resposne = await mutateUser({
        // @ts-ignore
        address: values!.address,
        documentIssuingCountry: "EE",
        nationality: "EE",
        placeOfBirth: "EST",
      });
      notify("Upated successfully!", "success");
      initFetch();
    } catch (err) {
      console.log("Failed to update", err);
      notify("Failed to update!", "error");
    }
  };
  const formik = useFormik({
    initialValues: { ...user },
    validationSchema: signupSchema,
    onSubmit: handleUserUpdate,
  });
  const initAddress = {
    address: {
      addressLine1: "Test line 1",
      addressLine2: "Test address line 1",
      city: "Test_city",
      postalCode: "12345",
      state: "State",
      country: "EE",
    },
    documentIssuingCountry: "EE",
    nationality: "EE",
    placeOfBirth: "EST",
  };

  useEffect(() => {
    if (user) formik.setValues(user);
  }, [user]);

  console.log(formik.errors);

  return (
    <Grid gap={4}>
      <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Hello {user?.firstName} 👋
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Complete your KYC before we can begin!
        </Text>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} align="flex-start">
          <VStack
            spacing={4}
            align="flex-start"
            width="100%"
            position="relative"
          >
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
              <Grid templateColumns="1fr 100px" gap={4}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <Button
                  type="button"
                  colorScheme="green"
                  disabled={user?.KYC?.emailVerified}
                  variant={user?.KYC?.emailVerified ? "outline" : "solid"}
                  width="auto"
                  _disabled={{
                    cursor: "not-allowed",
                    variant: "outline",
                  }}
                  onClick={onEmailVerify}
                >
                  {user?.KYC?.emailVerified ? "Verified" : "Verify"}
                </Button>
              </Grid>
              {formik.touched.email && formik.errors.email && (
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="mobile?.number">Mobile Number</FormLabel>
              <Grid templateColumns="80px 1fr 100px" gap={4}>
                <Input
                  id="mobile?.countryCode"
                  name="mobile?.countryCode"
                  type="string"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.mobile?.countryCode}
                />
                <Input
                  id="mobile?.number"
                  name="mobile?.number"
                  type="number"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.mobile?.number}
                />
                <Button
                  type="button"
                  colorScheme="green"
                  disabled={user?.KYC?.mobileVerified}
                  width="auto"
                  variant={user?.KYC?.mobileVerified ? "outline" : "solid"}
                  _disabled={{
                    cursor: "not-allowed",
                    variant: "outline",
                  }}
                  onClick={onPhoneVerify}
                >
                  {user?.KYC?.mobileVerified ? "Verified" : "Verify"}
                </Button>
              </Grid>
              {formik.touched.mobile && formik.errors.mobile && (
                <FormErrorMessage>{formik.errors.mobile}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="addressLine1">Address Line 1</FormLabel>
              <Input
                id="addressLine1"
                name="address.addressLine1"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values?.address?.addressLine1}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="addressLine2">Address Line 2</FormLabel>
              <Input
                id="addressLine2"
                name="address.addressLine2"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values?.address?.addressLine2}
              />
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap={4} w="100%">
              <FormControl>
                <FormLabel htmlFor="city">City</FormLabel>
                <Input
                  id="city"
                  name="address.city"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values?.address?.city}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                <Input
                  id="postalCode"
                  name="address.postalCode"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values?.address?.postalCode}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap={4} w="100%">
              <FormControl>
                <FormLabel htmlFor="state">State</FormLabel>
                <Input
                  id="state"
                  name="address.state"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values?.address?.state}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="country">Country</FormLabel>
                <Input
                  id="country"
                  name="address.country"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values?.address?.country}
                />
              </FormControl>
            </Grid>
            {loading ? (
              <Box
                position="absolute"
                top={-7}
                right={-7}
                bottom={-7}
                left={-7}
                borderRadius={12}
                bg="rgba(0, 0, 0, 0.3)"
                zIndex={10}
                pointerEvents="auto"
                marginTop="0"
                cursor="not-allowed"
              />
            ) : null}
          </VStack>
          <Grid
            templateColumns="1fr 1fr"
            gap={4}
            w="100%"
            sx={{
              marginTop: "40px !important",
            }}
          >
            <Button type="submit" colorScheme="green" width="full">
              Update Data
            </Button>
            {user && user.KYC.status === KYC_STATUS.INITIATED ? (
              <>
                <Button
                  type="button"
                  colorScheme="green"
                  width="full"
                  sx={{
                    cursor:
                      user.KYC.status !== KYC_STATUS.INITIATED
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={onSimulateKyc}
                >
                  Simulate KYC
                </Button>
              </>
            ) : null}
            {user && user.KYC.status === KYC_STATUS.NOT_STARTED ? (
              <>
                <Button
                  type="button"
                  colorScheme="green"
                  width="full"
                  sx={{
                    cursor:
                      user?.KYC?.status !== KYC_STATUS.NOT_STARTED ||
                      !user?.KYC?.emailVerified ||
                      !user?.KYC?.mobileVerified
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={onStartKyc}
                  disabled={
                    user &&
                    (!user?.KYC?.emailVerified || !user?.KYC?.mobileVerified)
                  }
                >
                  Start KYC
                </Button>
                {user &&
                (!user?.KYC?.emailVerified || !user?.KYC?.mobileVerified) ? (
                  <Text fontSize="sm" color="gray.500">
                    Verify mobile, email and complete address to start KYC.
                  </Text>
                ) : null}
              </>
            ) : null}
          </Grid>
        </VStack>
      </form>
    </Grid>
  );
};

export default Signup;

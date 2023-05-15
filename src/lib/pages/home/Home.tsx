import React, { useState, useEffect, useContext } from "react";
import useFetch from "lib/utils/hooks/useFetch";
import { useMutation } from "lib/utils/hooks/useMutation";
import { notify } from "lib/utils";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { UserContext } from "lib/context/UserContext";
import { KYC_STATUS } from "../profile";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { mutate: fetchWallets } = useMutation<IWallet>("/wallet/get");
  const [walletData, setWalletData] = useState<IWallet | null>(null);

  useEffect(() => {
    initFetch();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.KYC.status !== KYC_STATUS.APPROVED) {
        notify("Please approve KYC first!", "error");
        navigate("/profile");
      }
    }
  }, [user]);

  const initFetch = async () => {
    try {
      const res = await fetchWallets({});
      setWalletData(res?.data);
    } catch (err) {
      notify("Failed to fetch data", "error");
    }
  };

  return (
    <Grid gap={4}>
      <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="bold">
          Manage Wallets
        </Heading>

        <Grid>
          <Flex gap="10px" flexWrap="wrap" justifyContent="center" mt={4}>
            {walletData ? (
              walletData.accounts.map((account) => (
                <Box
                  maxW="300px"
                  p="4"
                  border="2px solid gray"
                  borderRadius="3xl"
                  cursor="pointer"
                  display="flex"
                  flexDir="column"
                  alignItems="flex-start"
                  _hover={{
                    bg: "rgba(0,0,0,0.1)",
                  }}
                  w="100%"
                >
                  <Flex
                    justifyContent="space-between"
                    w="100%"
                    alignItems="center"
                  >
                    <Text fontSize="lg" fontWeight="semibold">
                      {account.currency}
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold">
                      {account.availableBalance.amount +
                        " " +
                        account.availableBalance.currency}
                    </Text>
                  </Flex>
                  <Text mt="2">Card : {account.linkedCardId}</Text>
                  {account?.linkedBankAccountId ? (
                    <Text mt="2">Account : {account.linkedBankAccountId}</Text>
                  ) : null}
                </Box>
              ))
            ) : (
              <Text fontSize="xl" fontWeight="bold">
                Loading...
              </Text>
            )}
          </Flex>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;

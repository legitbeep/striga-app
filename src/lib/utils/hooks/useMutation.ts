import { useCallback, useState } from "react";
import { KEYS, calcSig, getItemInStorage, strigaConfig } from "lib/utils";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "process";

type HttpMethod = "post" | "put" | "delete" | "get" | "patch";

type UseFetchResult<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

type UseMutateResult<T> = {
  mutate: (body?: any) => Promise<AxiosResponse<T>>;
} & UseFetchResult<T>;

export function useMutation<T>(
  url: string,
  method: HttpMethod = "post"
): UseMutateResult<T> {
  const [state, setState] = useState<UseFetchResult<T>>({ loading: false });
  const tokenData = getItemInStorage(KEYS.tokenStorage);

  const mutate = useCallback(
    (body?: any): Promise<AxiosResponse<T>> => {
      setState({ loading: true });

      const headers = {
        authorization: calcSig(body, method),
        "x-authorization": tokenData ? tokenData?.token : "",
        "api-key": KEYS.apiKey,
        "Content-Type": "application/json",
      };
      const config: AxiosRequestConfig = {
        url: `${strigaConfig.baseUrl}${url}`,
        method,
        headers,
        data: body,
      };

      return axios(config)
        .then((response: AxiosResponse<T>) => {
          setState({ data: response.data, loading: false });
          return response;
        })
        .catch((error) => {
          setState({ error, loading: false });
          throw error;
        });
    },
    [url, method]
  );

  return { mutate, ...state };
}

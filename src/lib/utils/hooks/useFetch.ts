import { useState, useEffect, useCallback } from "react";
import axios, {
  AxiosHeaders,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { KEYS, strigaConfig, calcSig } from "lib/utils";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

interface FetchState<T> {
  data?: T;
  error?: any;
  loading: boolean;
}

type UseFetchResult<T> = {
  data?: T;
  error?: any;
  lazyFetch: (body?: any, config?: AxiosRequestConfig) => AxiosPromise<T>;
  loading: boolean;
};

interface IOptions {
  notIncludeBase?: boolean;
  lazy?: boolean;
}

function useFetch<T>(
  url: string,
  method: HttpMethod = "get",
  body?: any,
  options?: IOptions
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ loading: true });

  const lazyFetch = useCallback(
    (
      body?: any,
      otherConfig?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      let cancelled = false;
      const headers = {
        authorization: calcSig(body, method),
        "api-key": KEYS.apiKey,
        "Content-Type": "application/json",
      };
      let config: AxiosRequestConfig = {
        headers,
        data: body,
      };

      setState({ loading: true });

      const axiosConfig: AxiosRequestConfig = {
        url: !options?.notIncludeBase ? `${strigaConfig.baseUrl}${url}` : url,
        method,
        ...(otherConfig ? otherConfig : config),
      };

      return axios(axiosConfig)
        .then((response: AxiosResponse<T>) => {
          if (!cancelled) {
            setState({ data: response.data, loading: false });
          }
          return response;
        })
        .catch((error) => {
          if (!cancelled) {
            setState({ error, loading: false });
          }
          throw error;
        });
    },
    [url, method]
  );

  useEffect(() => {
    if (!options || !options?.lazy) lazyFetch();
  }, [url, method, options]);

  return { ...state, lazyFetch };
}

export default useFetch;

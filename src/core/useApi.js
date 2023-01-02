import { useState } from "preact/hooks";

export function useApi(initialLoading = false) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(initialLoading);

  const run = async (promise) => {
    if (!promise || !promise.then) {
      return promise;
    }

    setIsLoading(true)

    try {
      const result = await promise;
      setData(result)
      return Promise.resolve(result);
    } catch (err) {
      setError(err)
      return Promise.reject(err);
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, run }
}

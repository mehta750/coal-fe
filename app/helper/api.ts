import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import showToast from './toast';

export const usePostApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const post = async (url: string, payload: Object, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(url, payload, config);
      setData(response.data);
      showToast("info", "Submitted", "")
      return response.data;
    } catch (err: any) {
      const error = err?.response?.data.detail || err?.response?.data.title || "Something went wrong..."
      showToast('error', 'Error', error)
      setError(error || 'Something went wrong');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { post, isLoading, error, data };
}

export const useGetApi = (url: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const fetch = useCallback(async()=> {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(url);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Something went wrong');
      throw err;
    } finally {
      setIsLoading(false);
    }
  },[url])
  useEffect(() => {
    fetch()
  }, [fetch, refetchIndex]);
  const refetch = () => setRefetchIndex(prev => prev + 1);
  return { data, isLoading, error, refetch  };
}

const APIFetch={usePostApi, useGetApi}
export default APIFetch

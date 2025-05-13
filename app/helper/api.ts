import axios from 'axios';
import { useEffect, useState } from 'react';
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
      const error = err?.response?.data || err.message || err?.response?.data.detail
      showToast('error', 'Error', error || '')
      setError(error?.detail || 'Something went wrong');
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
  const fetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(url);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      console.log('GET Error:', err?.response?.data || err.message);
      setError(err?.response?.data || 'Something went wrong');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch()
  }, [url]);

  return { data, isLoading, error, refetch: fetch };
}

const APIFetch={usePostApi, useGetApi}
export default APIFetch

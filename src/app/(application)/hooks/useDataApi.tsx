import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ICampground, IUser } from '../interfaces';

interface IEmptyCG {
  campground: ICampground;
  campgrounds: ICampground[];
  user: IUser;
}
 
const useDataApi = (initialUrl: string, initialData: IEmptyCG): [{ data: IEmptyCG; isLoading: boolean; isError: string; }, React.Dispatch<React.SetStateAction<string>>] => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState('');
 
  useEffect(() => {
    let source = axios.CancelToken.source();
    const fetchData = async () => {
      setIsError('');
      setIsLoading(true);
  
      try {
        const result = await axios(url, { cancelToken: source.token });
        setData(result.data);
      } catch (error) {
        const err = error as AxiosError
        if (err.response?.data) {
          let message = err.response.data;
          if (typeof message === 'object') {
            message = JSON.stringify(message, null, 2);
          }
          setIsError(message as string);
        }
        if (axios.isCancel(err)) {
          console.log(`axios call was cancelled`);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
    return () => { source.cancel(); }
  }, [url]);
 
  return [
    { data, isLoading, isError },
    setUrl
  ];
};

export default useDataApi;

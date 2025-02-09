import React, { useEffect, useState } from 'react'
import useApi from './useApi';

const useFetchFileList = (referenceID) => {  
    const api = useApi()
    const [fileList, setFileList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFileList = async (referenceID) => {
        try {
          const res = await api.get(`/api/files/list/singleFile/${referenceID}`);

          setFileList(res.data); // Update state with the degree data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching file list: ", error);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchFileList(referenceID); // Call the async function within useEffect
    }, [referenceID]);

  return {fileList, loading, error}
}

export default useFetchFileList
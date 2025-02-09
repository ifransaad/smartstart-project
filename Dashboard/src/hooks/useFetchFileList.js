import React, { useEffect, useState } from 'react'
import useApi from './useApi';

const useFetchFileList = (referenceID, isOrder) => {  
    const api = useApi()
    const [fileList, setFileList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFileList = async (referenceID, isOrder) => {
        try {
          const res = await api.get(`/api/files/list/singleFile/${referenceID}/${isOrder}`);

          setFileList(res.data); // Update state with the degree data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching file list: ", error);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchFileList(referenceID, isOrder); // Call the async function within useEffect
    }, [referenceID, isOrder]);

  return {fileList, loading, error}
}

export default useFetchFileList
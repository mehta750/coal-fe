
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import showToast from '../helper/toast'
import API, { getFetchApi } from './api'

interface Props {
  disabled?: boolean
  name?: string
  width?: number
  refetchOnMount?: boolean
}

const RawMaterialSelection = (props: Props) => {
  const { disabled = false, name="rawMaterial", width=300, refetchOnMount = false } = props
  const {data, refetch} = useRawMaterialFetchData()

   useEffect(() => {
      if (refetchOnMount) {
        refetch();
      }
    }, [refetchOnMount]);

     const items = useMemo(() => {    
        if (data) {
          return data.map((d: any) => ({
            label: d.rawMaterialName,
            value: d.rawMaterialId,
          }));
        }
    
        return [];
      }, [data]);
  return (
    <FormikDropdown width={width} label={"Raw material"} disabled={disabled} name={name} items={items} placeholder="Select a raw material" />
  )
}

export default RawMaterialSelection


export const useRawMaterialFetchData = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchParties = useCallback(async () => {
    setLoading(true);
    try {
      const res:any = await getFetchApi(API.rawmaterials);
      setData(res?.data || []);
    } catch (error: any) {
      showToast('error', 'Error', error || 'Error fetching parties')
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  return { data, loading, refetch: fetchParties };
};
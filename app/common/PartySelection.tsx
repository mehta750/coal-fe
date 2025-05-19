import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useAuth } from '../context/AuthContext'
import showToast from '../helper/toast'
import API, { getFetchApi } from './api'

type PartiesData = {
  label: string,
  value: number | string,
}
interface Props {
  partiesData?: PartiesData[] | null
  disabled?: boolean
  width?: number
  refetchOnMount?: boolean
}
const PartySelection = (props: Props) => {
  const { partiesData, disabled = false, width=300, refetchOnMount = false } = props
  const { authState, callPartnerParties } = useAuth()
  const isAdmin = authState?.role?.includes("admin") || false
  const { data, refetch } = usePartiesFetch() as any;

  useEffect(() => {
    if (!isAdmin) {
      callPartnerParties();
    } else if (refetchOnMount) {
      refetch();
    }
  }, [isAdmin, refetchOnMount]);
  const items = useMemo(() => {
    if (partiesData) return partiesData;

    if (isAdmin && data) {
      return data.map((d: any) => ({
        label: d.partyName,
        value: d.partyId,
      }));
    }

    return authState?.parties || [];
  }, [partiesData, isAdmin, data, authState?.parties]);

  return (
    <FormikDropdown width={width} label={"Party"} disabled={disabled} name="party" items={items} placeholder="Select party" />
  )
}

export default PartySelection




export const usePartiesFetch = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchParties = useCallback(async () => {
    setLoading(true);
    try {
      const res:any = await getFetchApi(API.partiesURL);
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
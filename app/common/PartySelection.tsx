import React, { useEffect } from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useAuth } from '../context/AuthContext'
import { usePartiesFetch } from './api'

type PartiesData = {
  label: string,
  value: number | string,
}
interface Props {
  partiesData?: PartiesData[] | null
  disabled?: boolean
}
const PartySelection = (props: Props) => {
  let partiesArray = null
  const { partiesData, disabled = false } = props
  const { authState, callPartnerParties } = useAuth()
  const isAdmin = authState?.role?.includes("admin") || false
  useEffect(()=> {
    if(!isAdmin)
      callPartnerParties()
  },[])
  partiesArray = authState?.parties
  if (isAdmin) {
    const { data } = usePartiesFetch() as any
    partiesArray = data?.map((d: any) => ({ label: d.partyName, value: d.partyId }))
  }
  const items = (partiesData || partiesArray)
  return (
    <FormikDropdown disabled={disabled} name="party" items={items} placeholder="Select party" />
  )
}

export default PartySelection
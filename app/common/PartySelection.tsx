import React from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { usePartiesFetch } from './api'

type PartiesData = {
  partyName: string,
  partyId: number,
  plantId: number
}
interface Props {
  partiesData?: PartiesData[] | null
  disabled?: boolean
}
const PartySelection = (props: Props) => {
    const {partiesData, disabled = false} = props
    const {data} = usePartiesFetch() as any
    const items = (partiesData || data)?.map((d: PartiesData) => ({label: d.partyName, value: d.partyId}))
  return (
    <FormikDropdown disabled={disabled} name="party" items={items} placeholder="Select party" />
  )
}

export default PartySelection
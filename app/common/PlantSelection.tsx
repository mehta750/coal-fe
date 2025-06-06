
import React from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useAuth } from '../context/AuthContext'

interface Props {
  disabled?: boolean,
  name?: string
  width?: number
}

const PlantSelection = (props: Props) => {
  const { disabled = false, name = "plant", width=300 } = props
  const { authState } = useAuth()
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const plants = authState?.plants || []
  return (
    <FormikDropdown width={width} label={"Plant"} disabled={disabled || isPartner} name={name} items={plants} placeholder="Select a plant" />
  )
}

export default PlantSelection
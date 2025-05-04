
import React from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useAuth } from '../context/AuthContext'

interface Props {
  disabled?: boolean
}

const PlantSelection = (props: Props) => {
  const {disabled = false} = props
  const {authState} = useAuth()
  const plants = authState?.plants || []
  return (
    <FormikDropdown disabled={disabled} name="plant" items={plants} placeholder="Select a plant" />
  )
}

export default PlantSelection

import React from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useRawMaterialFetch } from './api'

interface Props {
  disabled?: boolean
}

const RawMaterialSelection = (props: Props) => {
  const { disabled = false } = props
  const { data } = useRawMaterialFetch() as any
  const items = data?.map((item: { rawMaterialId: number, rawMaterialName: string }) => ({ label: item.rawMaterialName, value: item.rawMaterialId }))
  return (
    <FormikDropdown disabled={disabled} name="rawMaterial" items={items} placeholder="Select a raw material" />
  )
}

export default RawMaterialSelection
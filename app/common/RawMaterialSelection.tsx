
import React from 'react'
import FormikDropdown from '../componets/FormikDropdown'
import { useRawMaterialFetch } from './api'

interface Props {
  disabled?: boolean
  name?: string
  width?: number
}

const RawMaterialSelection = (props: Props) => {
  const { disabled = false, name="rawMaterial", width=300 } = props
  const { data } = useRawMaterialFetch() as any
  const items = data?.map((item: { rawMaterialId: number, rawMaterialName: string }) => ({ label: item.rawMaterialName, value: item.rawMaterialId }))
  return (
    <FormikDropdown width={width} label={"Raw material"} disabled={disabled} name={name} items={items} placeholder="Select a raw material" />
  )
}

export default RawMaterialSelection
import React from 'react'
import Center from './Center'
import CustomText from './CustomText'

const ContactusComponent = () => {
  return (
    <Center gap={10}>
        <CustomText size={16} text={"environmentcleanerspvtltd@gmail.com"}/>
        <CustomText size={20} text={"7357912345"} />
    </Center>
  )
}

export default ContactusComponent
import React from 'react'
import ContactusComponent from '../componets/ContactusComponent'
import Header from '../componets/Header'
import { fetchRoutes } from '../routes'

const Contactus = () => {
  const Rooutes:any = fetchRoutes()
  return (
      <>
          <Header isMenu={false} isLogoClickable={false} title={Rooutes.contactus}/>
          <ContactusComponent/>
      </>
  )
}

export default Contactus
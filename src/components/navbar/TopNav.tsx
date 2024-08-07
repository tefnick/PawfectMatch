import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import React, { act } from 'react'
import { GiSittingDog } from 'react-icons/gi'
import NavLink from './NavLink'

export default function TopNav() {
  return (
    <Navbar
      maxWidth='xl'
      className='bg-gradient-to-r from-green-500 to-orange-400'
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-blue-600"
        ],
      }}
    >
    
      <NavbarBrand>
        <GiSittingDog className="text-gray-900" size={40}/>
        <div className='font-bold text-3xl flex '>
          <span className='text-gray-900'>Pawfect</span>
          <span className='text-gray-200'>Match</span>
        </div>
      </NavbarBrand>
      
      <NavbarContent justify='center'>
        <NavLink href='/members' label='Matches'/>
        <NavLink href='/lists' label='Lists'/>
        <NavLink href='/messages' label='Messages'/>
      </NavbarContent>
      <NavbarContent justify='end'>
        <Button variant='bordered' className='text-white' as={Link} href='/login'>Login</Button>
        <Button variant='bordered' className='text-white' as={Link} href='/register'>Register</Button>
      </NavbarContent>
    </Navbar>
  )
}

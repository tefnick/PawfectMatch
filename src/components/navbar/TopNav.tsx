import { Button, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { GiSittingDog } from 'react-icons/gi'
import NavLink from './NavLink'
import { auth } from '@/auth'
import UserMenu from './UserMenu'

export default async function TopNav() {
  const session = await auth();

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
      {/* Top Left Logo */}
      <NavbarBrand>
        <GiSittingDog className="text-gray-900" size={40}/>
          <Link href='/'>
            <div className='font-bold text-3xl flex '>
              <span className='text-gray-900'>Pawfect</span>
              <span className='text-gray-200'>Match</span>
            </div>
          </Link>
      </NavbarBrand>
      
      {/* Center Nav Links */}
      <NavbarContent justify='center'>
        <NavLink href='/dogs' label='Matches'/>
        <NavLink href='/lists' label='Lists'/>
        <NavLink href='/messages' label='Messages'/>
      </NavbarContent>

      {/* Top Right Auth Links */}
      <NavbarContent justify='end'>
        {session?.user? (
          <UserMenu user={session.user} />
        ) : (
            <>
              <Button variant='bordered' className='text-white' as={Link} href='/login'>Login</Button>
              <Button variant='bordered' className='text-white' as={Link} href='/register'>Register</Button>
            </>
          )
        }
      </NavbarContent>
    </Navbar>
  )
}

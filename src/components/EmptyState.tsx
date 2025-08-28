import { Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'

export default function EmptyState() {
  return (
    <div className='flex justify-center items-center mt-20'>
      <Card className='shadow-lg'>
        <CardHeader className='text-3xl text-secondary px-4'>
          There are no results for this filter
        </CardHeader>
        <CardBody className='text-center mb-2'>
          Please select a different filter
        </CardBody>
      </Card>
    </div>
  )
}

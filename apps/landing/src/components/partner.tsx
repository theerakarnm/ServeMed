import React from 'react'
import { Card, CardContent } from '@workspace/ui/components/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@workspace/ui/components/carousel';

const PartnerSection = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className='w-full max-w-sm'>
      <CarouselContent>
        {
          Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className='md:basis-1/2 lg:basis-1/3'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-3xl font-semibold'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export { PartnerSection }

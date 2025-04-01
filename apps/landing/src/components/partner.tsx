import React from 'react'
import { Card, CardContent } from '@workspace/ui/components/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';
import Autoplay from "embla-carousel-autoplay"

const partnerList = [
  '/partners/bitsocial.png',
  '/partners/gpo.png',
  '/partners/NIA.svg',
  '/partners/sandbox88.png',
  '/partners/ted.png',
  '/partners/thailand-startup.png',
  '/partners/pmcu.png',
  '/partners/thailand-fund.png',
  '/partners/martech.webp',
]

const PartnerSection = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className='w-full max-w-3xl'>
      <CarouselContent>
        {
          partnerList.map((key, index) => (
            <CarouselItem
              key={key}
              className='md:basis-1/3 lg:basis-1/5'>
              <div className='p-1'>
                <Card className='flex aspect-square items-center justify-center'>
                  <CardContent className={cn('flex aspect-square items-center justify-center p-2', {
                    'bg-gray-800': index === 0,
                  })}>
                    <img
                      src={key}
                      alt='partner logo'
                      className='h-full w-full object-contain'
                    />
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

import { Button } from '@/components/ui/button'
import HeroSection from '@/components/HeroSection'
import React from 'react'
import { sampleBooks } from '@/lib/constants'
import BookCard from '@/components/BookCard'

const page = () => {
  return (
    <main className='wrapper container'>
      <HeroSection />
      <div className='library-books-grid'>
        {sampleBooks.map((book) => (
          <BookCard
            key={book._id} // _id because later we use mongoDB
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}  
          />
        ))}
      </div>
    </main>
  )
}

export default page
## Home Page UI
### Hero Section
Creating the [HeroSection.tsx](/components/ui/HeroSection.tsx) is straight forward. We get the images for this section from `public/assests`. 

After that, we import that component and place in to our main [page](/app/page.tsx)
```tsx
const page = () => {
  return (
    <main className='wrapper container'>
      <HeroSection />
    </main>
  )
}

export default page
```

### Book Cards Section
We want this component so the user can select the book that they save and want to chat to.'

We get our book data from `lib/constants.ts` and we can pass that data from `page.tsx` to later on a component called `BookCard.tsx`.

`app/page.tsx`:
```tsx
import { Button } from '@/components/ui/button'
import HeroSection from '@/components/ui/HeroSection'
import React from 'react'
import { sampleBooks } from '@/lib/constants'
import BookCard from '@/components/ui/BookCard'

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
```

`BookCard.tsx`:
```tsx 
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

interface BookCardProps {
    title: string;
    author: string;
    coverURL: string;
    slug: string
}

const BookCard = ( {title, author, coverURL, slug}: BookCardProps) => {
  return (
    <Link href={`books/${slug}`}> 
        <article className='book-card'>
            <figure className='book-card-figure'>
                <div className='book-card-cover-wrapper'>
                    <Image
                        src={coverURL}
                        alt={title}
                        width={133}
                        height={200}
                        className='book-card-cover'
                    />
                </div>
            </figure>
            <figcaption className='book-card-meta'>
                <h3 className='book-card-title'>{title}</h3>
                <p className='book-card-author'>{author}</p> 
            </figcaption>
        </article> 
    </Link>
  )
}

export default BookCard
```

This code is completed but it won't work yet because Next.js has a built-in security feature for its `<Image />` component. By default, Next.js only allows images to be loaded from the same domain where our application is hosted.

To protect our application from malicious external images, we must explicitly "allowlist" any external hostnames you want to use in your `next.config.js` or   `next.config.mjs` file.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

After we save this change to our config file, we must stop and restart our development server.

Now we have to decide between creating the book conversation feature, add new book feature, or database so we can upload books? It makes more sense to do the add new book feature because then we know what fields to structure within our database.

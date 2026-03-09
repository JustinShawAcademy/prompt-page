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
We want this component so the user can select the book that they save and want to chat to.

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

## Create New Book Page
To add a new page, we're going to create a new route. 

We can also create a new **root group** (a folder wrapped in `()`). We add a route group named `(root)` in `./app`. This folder won't be added to the URL bar but can have it's own layout.

The `app` folder should now look like this:
```
.
├── (root)
│   └── books
│       └── new
│           └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

And now we can use `rafce` shortcut in `new/page.tsx` that will be our page when we click on `Add new` on the narbar or hero section

`new/page.tsx`: 
```ts
import React from 'react'
import UploadForm from '@/components/UploadForm'

const page = () => {
  return (
    <main className='wrapper container'>
      <div className='mx-auto max-w-180 space-y-10'>
        <section className='flex flex-col gap-5'>
          <h1 className='page-title-xl'>Add a New Book</h1>
          <p className='subtitle'>Upload a PDF to generate your interactive interview</p>
        </section>

        <UploadForm />
      </div>
    </main>
  )
}

export default page
```

The `<UploadForm/>` component is used to take in user data.

We create this as a standalone component even though we only use it in one place because the form needs **browser functionalities** (file inputs, form state, event handlers). That means we need `'use client'` so it renders client-side. The parent `page.tsx` stays as a Server Component — only the form itself t.

### Installing shadcn Form + Dependencies

We use [shadcn react-hook-form](https://ui.shadcn.com/docs/forms/react-hook-form) which bundles three libraries together:

```bash
npx shadcn@latest add form
```

This installs:
- **react-hook-form** — manages form state, validation, and submission without re-rendering on every keystroke (useForm)
- **zod** — schema-based validation (we define the shape of valid data, and it generates TypeScript types for us)
- **@hookform/resolvers** — the bridge that connects zod schemas to react-hook-form

It also creates `components/ui/form.tsx` which gives us wrapper components: `Form`, `FormField`, `FormItem`, `FormMessage`, etc. that we will use in `<UploadForm />`

### [Zod Schema](https://ui.shadcn.com/docs/forms/react-hook-form#create-a-form-schema) — Define the Shape First

Before building any UI, we define what valid form data looks like. We do this in `<UploadForm />`:

```ts
import { z } from 'zod'

const formSchema = z.object({
  pdf: z
    .custom<File>((val) => val instanceof File, 'Please upload a PDF file')
    .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), 'Only PDF files are accepted')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be less than 50MB'),
  coverImage: z
    .custom<File | null>(...)
    .optional()
    .nullable(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  voice: z.string().min(1, 'Please select a voice'),
})
```

You might wonder: *"Why write all that Zod code when I could just put `required` and `minLength={2}` on my HTML input?"*

**TODO: Write a lesson on Zod. This is really interesting**
Is it is the industry standard in the Typescirpt ecosystem. It is worth it learning deeply.


- Complex Logic:  HTML can't easily check if a file is a PDF and under 50MB. Zod handles that easily with `.refine()`:
- Custom Errors: You can write specific, user-friendly error messages directly in the schema.
- Single Source of Truth: You can export that formSchema and use it on your Server (Node.js/Next.js API). This ensures the backend and frontend are using the exact same rules, preventing "hackers" from bypassing your frontend validation.
- Conditional Validation: You can make rules like: "If the user selects 'Male Voice', the 'Title' must be at least 5 characters." (HTML can't do that)


Key patterns:
- `z.custom<File>()` — for browser `File` objects that aren't plain JSON types. The first argument is a **type guard** function that checks at runtime.
- `.refine()` — chain custom validations after the base type check. Each `.refine()` runs only if the previous check passed.
- `.optional().nullable()` — `coverImage` can be `undefined` (not set) or `null` (explicitly cleared). This lets us set the default to `null` and skip validation when empty.
- `z.infer<typeof formSchema>` — extracts a TypeScript type from the schema, so our form values are fully typed without writing the interface manually. aka Zod resolver.

### React Hook Form Setup
useForm is the Manager. It tracks what the user types in every box so the page doesn't re-render every time you hit a key.

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),   // connects zod to react-hook-form
  defaultValues: {
    title: '',
    author: '',
    voice: DEFAULT_VOICE,              // pre-select 'rachel'
    coverImage: null,                  // null = no file selected
  },
})
```

The `zodResolver` means: when the user submits, react-hook-form passes the values through our zod schema. If validation fails, errors are set on the matching fields. If it passes, `onSubmit` fires with typed data.

### File Upload Pattern (with hidden input + dropzone)

File inputs can't be controlled by react-hook-form directly (browsers don't let you set their value programmatically). Instead we:

1. Hide the real `<input type="file">` with `className="hidden"`
2. Show a styled dropzone `<div>` that the user clicks
3. Wire the click: `onClick={() => pdfInputRef.current?.click()}`
4. On file selection, manually push the file into react-hook-form: `field.onChange(file)`

```tsx
<FormField
  control={form.control}
  name="pdf"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="form-label">Upload Book PDF</FormLabel>
      <div
        className={cn(
          'upload-dropzone border-2 border-dashed border-[var(--border-medium)]',
          field.value && 'upload-dropzone-uploaded',
        )}
        onClick={() => pdfInputRef.current?.click()}
      >
        <input
          type="file"
          ref={pdfInputRef}
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) field.onChange(file)
          }}
        />
        {field.value ? (
          /* show filename + remove button */
        ) : (
          /* show upload icon + hint text */
        )}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

The `useRef` + hidden input pattern is the standard way to style file uploads in React. The `accept` attribute is a browser hint (not security — zod handles real validation).

### Voice Selector — Radio Cards without `<input type="radio">`

Instead of native radio buttons, we use clickable `<div>` cards managed by react-hook-form. Each card calls `field.onChange(key)` when clicked, and we toggle CSS classes based on `field.value === key`:

```tsx
<div
  className={cn(
    'voice-selector-option',
    isSelected ? 'voice-selector-option-selected' : 'voice-selector-option-default',
  )}
  onClick={() => field.onChange(key)}
>
```

The voice data comes from `lib/constants.ts` which has `voiceCategories` (groups by gender) and `voiceOptions` (name + description per voice). This keeps the UI component free of hardcoded voice data.

### LoadingOverlay — Portal-style Full-Screen Overlay

When the form is submitting, we show a `<LoadingOverlay />` component that uses `fixed inset-0 z-50` (via the `loading-wrapper` CSS class) to cover the entire viewport with a semi-transparent backdrop. The `isSubmitting` state gates it:

```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

{isSubmitting && <LoadingOverlay />}
```

The overlay is rendered *outside* the `<Form>` so it sits above everything. The CSS classes (`loading-wrapper`, `loading-shadow`, `loading-animation`, etc.) are all pre-defined in `globals.css`.

### Next Steps
Now we can form our database structure in a way to accept all these fields properly and store them in the database so later on we can display them. 
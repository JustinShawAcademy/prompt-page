'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, ImageIcon, X } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  voiceOptions,
  voiceCategories,
  DEFAULT_VOICE,
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/components/LoadingOverlay'

const formSchema = z.object({
  pdf: z
    .custom<File>((val) => val instanceof File, 'Please upload a PDF file')
    .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), 'Only PDF files are accepted')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be less than 50MB'),
  coverImage: z
    .custom<File | null>(
      (val) => val === null || val === undefined || val instanceof File,
      'Invalid file',
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, PNG, and WebP images are accepted',
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      'Image must be less than 10MB',
    )
    .optional()
    .nullable(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  voice: z.string().min(1, 'Please select a voice'),
})

type FormValues = z.infer<typeof formSchema>

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      voice: DEFAULT_VOICE,
      coverImage: null,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      console.log('Form submitted:', values)
      // TODO: wire up actual book creation API
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="new-book-wrapper">
          <div className="space-y-8">

            {/* PDF Upload */}
            <FormField
              control={form.control}
              name="pdf"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Upload Book PDF</label>
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
                      <div className="flex items-center gap-3">
                        <Upload className="upload-dropzone-icon !mb-0 !w-6 !h-6" />
                        <p className="upload-dropzone-text">{field.value.name}</p>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation()
                            field.onChange(undefined)
                            if (pdfInputRef.current) pdfInputRef.current.value = ''
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">Click to upload PDF</p>
                        <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image Upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Cover Image</label>
                  <div
                    className={cn(
                      'upload-dropzone border-2 border-dashed border-[var(--border-medium)]',
                      field.value && 'upload-dropzone-uploaded',
                    )}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={coverInputRef}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) field.onChange(file)
                      }}
                    />
                    {field.value ? (
                      <div className="flex items-center gap-3">
                        <ImageIcon className="upload-dropzone-icon !mb-0 !w-6 !h-6" />
                        <p className="upload-dropzone-text">{field.value.name}</p>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation()
                            field.onChange(null)
                            if (coverInputRef.current) coverInputRef.current.value = ''
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">Click to upload cover image</p>
                        <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Author Name</label>
                  <input
                    className="form-input"
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Voice Selector */}
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Choose Assistant Voice</label>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Male Voices
                      </p>
                      <div className="voice-selector-options">
                        {voiceCategories.male.map((key) => {
                          const voice = voiceOptions[key as keyof typeof voiceOptions]
                          const isSelected = field.value === key
                          return (
                            <div
                              key={key}
                              className={cn(
                                'voice-selector-option',
                                isSelected
                                  ? 'voice-selector-option-selected'
                                  : 'voice-selector-option-default',
                              )}
                              onClick={() => field.onChange(key)}
                            >
                              <div className="text-center">
                                <p className="font-semibold text-[var(--text-primary)]">
                                  {voice.name}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                  {voice.description}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Female Voices
                      </p>
                      <div className="voice-selector-options">
                        {voiceCategories.female.map((key) => {
                          const voice = voiceOptions[key as keyof typeof voiceOptions]
                          const isSelected = field.value === key
                          return (
                            <div
                              key={key}
                              className={cn(
                                'voice-selector-option',
                                isSelected
                                  ? 'voice-selector-option-selected'
                                  : 'voice-selector-option-default',
                              )}
                              onClick={() => field.onChange(key)}
                            >
                              <div className="text-center">
                                <p className="font-semibold text-[var(--text-primary)]">
                                  {voice.name}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                  {voice.description}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button type="submit" className="form-btn" disabled={isSubmitting}>
              Begin Synthesis
            </button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default UploadForm

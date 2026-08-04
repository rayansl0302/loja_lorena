import { useRef, useState } from 'react'
import { CloudUploadBold } from 'solar-icon-set'
import { toSafeImageSrc } from '@/utils/url'
import { isCloudinaryConfigured, uploadImageToCloudinary, validateImageFile } from '@/lib/cloudinary'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  folder: string
  placeholder: string
  hint: string
  previewClassName: string
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  placeholder,
  hint,
  previewClassName,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError('')
    setIsUploading(true)
    try {
      const url = await uploadImageToCloudinary(file, folder)
      onChange(url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Falha ao enviar a imagem.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <label className="flex flex-col gap-1.5 text-sm text-cream-100">
      {label}
      <div className="flex items-center gap-3">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-noir-700 bg-noir-800 ${previewClassName}`}
        >
          {toSafeImageSrc(value) ? (
            <img src={toSafeImageSrc(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-cream-300/50">sem foto</span>
          )}
        </div>
        <div className="flex w-full min-w-0 flex-col gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-w-0 rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
          {isCloudinaryConfigured && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex w-fit items-center gap-2 rounded-full border border-noir-600 px-3.5 py-1.5 text-xs font-medium text-cream-300 transition hover:border-gold-500 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CloudUploadBold size={14} />
                {isUploading ? 'Enviando...' : 'Enviar imagem'}
              </button>
            </>
          )}
        </div>
      </div>
      {uploadError && <span className="text-xs text-wine-600">{uploadError}</span>}
      <span className="text-xs text-cream-300/60">{hint}</span>
    </label>
  )
}

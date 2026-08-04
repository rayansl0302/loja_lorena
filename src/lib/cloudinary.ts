const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Selecione um arquivo de imagem (JPG, PNG ou WebP).'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'A imagem deve ter até 5MB.'
  }
  return null
}

export async function uploadImageToCloudinary(file: File, folder: string): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary não está configurado neste ambiente.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET!)
  formData.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Falha ao enviar a imagem. Tente novamente.')
  }

  const data = (await response.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Resposta inesperada do Cloudinary.')
  }
  return data.secure_url
}

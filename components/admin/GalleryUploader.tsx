"use client"

import { useState } from "react"
import { Upload, Copy, Check, Loader2, X } from "lucide-react"
import Container from "@/components/ui/Container"
import { uploadGalleryImage } from "@/app/actions/admin"
import { toast } from "sonner"
import S3Image from "@/components/ui/S3Image"

interface GalleryUploaderProps {
  type: "blog" | "cases"
}

export default function GalleryUploader({ type }: GalleryUploaderProps) {
  const [uploading, setLoading] = useState(false)
  const [images, setImages] = useState<{ url: string; copied: boolean }[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", type)

        const result = await uploadGalleryImage(formData)
        if (result.success && result.url) {
          setImages(prev => [{ url: result.url!, copied: false }, ...prev])
        } else {
          toast.error(result.error || "Upload failed")
        }
      }
      toast.success("GALLERY_UPDATED")
    } catch (err) {
      toast.error("Upload error")
    } finally {
      setLoading(false)
      e.target.value = "" // Reset input
    }
  }

  const copyMarkdown = (url: string, index: number) => {
    const markdown = `![image](${url})`
    navigator.clipboard.writeText(markdown)
    
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, copied: true } : img
    ))

    setTimeout(() => {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, copied: false } : img
      ))
    }, 2000)

    toast.success("MARKDOWN_COPIED")
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold tracking-widest text-white uppercase">CONTENT_GALLERY</h3>
          <p className="text-[10px] font-mono text-muted mt-1 uppercase">Upload images to use in markdown</p>
        </div>
        
        <label className="cursor-pointer group">
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleUpload}
            disabled={uploading}
          />
          <Container variant="primary" className="py-2 px-4 flex items-center gap-2">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span className="font-bold text-[10px] tracking-widest">UPLOAD_ASSETS</span>
          </Container>
        </label>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="group relative border border-border bg-input overflow-hidden aspect-video">
              <S3Image src={img.url} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => copyMarkdown(img.url, idx)}
                  className="px-3 py-1.5 bg-primary text-white font-mono text-[9px] font-bold tracking-tighter flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {img.copied ? <Check size={12} /> : <Copy size={12} />}
                  {img.copied ? "COPIED" : "COPY_MARKDOWN"}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-white/50 hover:text-destructive transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-2 border-t border-border/50">
                <p className="text-[8px] font-mono text-muted truncate">{img.url}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border p-8 text-center bg-input/50">
          <p className="font-mono text-[10px] text-muted uppercase">No assets uploaded yet</p>
        </div>
      )}
    </div>
  )
}

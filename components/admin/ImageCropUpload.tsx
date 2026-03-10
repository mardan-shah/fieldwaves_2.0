"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import SkewContainer from "@/components/ui/SkewContainer"
import { Upload, Crop, Check, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface ImageCropUploadProps {
  currentImage?: string | null
  onCropped: (file: File) => void
  label?: string
  aspect?: number
  height?: string
}

async function getCroppedImg(imageSrc: string, crop: Area, rotation: number): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  const radians = (rotation * Math.PI) / 180
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))
  const newWidth = image.width * cos + image.height * sin
  const newHeight = image.width * sin + image.height * cos

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.translate(-crop.x, -crop.y)
  ctx.translate(newWidth / 2, newHeight / 2)
  ctx.rotate(radians)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], "cropped.jpg", { type: "image/jpeg" }))
    }, "image/jpeg", 0.92)
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", reject)
    img.src = url
  })
}

export default function ImageCropUpload({
  currentImage,
  onCropped,
  label = "IMAGE",
  aspect = 16 / 9,
  height = "h-36",
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [rawImage, setRawImage] = useState<string | null>(null)
  const [cropping, setCropping] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRawImage(url)
    setCropping(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ""
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels)
  }, [])

  const handleConfirmCrop = async () => {
    if (!rawImage || !croppedArea) return
    const croppedFile = await getCroppedImg(rawImage, croppedArea, rotation)
    const croppedUrl = URL.createObjectURL(croppedFile)
    setPreview(croppedUrl)
    setCropping(false)
    setRawImage(null)
    onCropped(croppedFile)
  }

  const handleCancelCrop = () => {
    setCropping(false)
    if (rawImage) URL.revokeObjectURL(rawImage)
    setRawImage(null)
  }

  return (
    <div>
      <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">{label}</label>

      {/* Crop Mode */}
      {cropping && rawImage ? (
        <div className="space-y-3">
          <div className="relative w-full bg-black border border-primary" style={{ height: "280px" }}>
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { borderRadius: 0 },
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut size={14} className="text-muted" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[var(--primary)] h-1"
              />
              <ZoomIn size={14} className="text-muted" />
            </div>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 border border-border text-secondary hover:text-primary hover:border-primary transition-colors"
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* Confirm / Cancel */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancelCrop}
              className="flex-1 py-2 bg-input border border-border text-secondary hover:text-white font-mono text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <X size={14} /> CANCEL
            </button>
            <button type="button" onClick={handleConfirmCrop} className="flex-1">
              <SkewContainer variant="primary" className="py-2 text-center" hoverEffect>
                <div className="flex items-center justify-center gap-2">
                  <Check size={14} />
                  <span className="font-bold tracking-widest text-xs">APPLY CROP</span>
                </div>
              </SkewContainer>
            </button>
          </div>
        </div>
      ) : preview ? (
        /* Preview Mode */
        <div className="space-y-2">
          <div className={`relative w-full bg-black border border-border overflow-hidden ${height}`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-mono text-muted flex-1">CURRENT</p>
            <label className="cursor-pointer flex items-center gap-1 text-xs font-mono text-secondary hover:text-primary transition-colors">
              <Crop size={12} /> CROP & REPLACE
              <input ref={inputRef} type="file" onChange={onFileSelect} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>
      ) : (
        /* Empty State */
        <label className="cursor-pointer block border border-dashed border-border bg-input p-6 text-center hover:border-primary transition-colors">
          <Upload size={20} className="mx-auto text-muted mb-2" />
          <p className="text-xs font-mono text-muted">UPLOAD IMAGE</p>
          <input ref={inputRef} type="file" onChange={onFileSelect} className="hidden" accept="image/*" />
        </label>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  id: string
  accept: string
  value: File | null
  onChange: (file: File | null) => void
  required?: boolean
}

export default function FileUpload({ id, accept, value, onChange, required }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFileName(file.name)
      onChange(file)
    }
  }

  const handleClear = () => {
    setFileName("")
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        id={id}
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required}
      />

      {!fileName ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="text-sm font-medium">คลิกเพื่ออัพโหลดไฟล์</p>
            <p className="text-xs text-muted-foreground">รองรับไฟล์ JPG, PNG และ PDF</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
            <span className="sr-only">ลบไฟล์</span>
          </Button>
        </div>
      )}
    </div>
  )
}


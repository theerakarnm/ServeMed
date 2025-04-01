"use client"

import type React from "react"

import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { FormSection } from "../form-section"
import FileUpload from "../file-upload"
import { Link } from "@remix-run/react"

interface DocumentsFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formData: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateFormData: (data: any) => void
  prevStep: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function DocumentsForm({ formData, updateFormData, prevStep, onSubmit }: DocumentsFormProps) {
  const handleFileChange = (field: string, file: File | null) => {
    updateFormData({ [field]: file })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">เอกสาร</h2>

      <FormSection title="แนบไฟล์">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="idCard">
              บัตรประชาชน <span className="text-red-500">*</span>
            </Label>
            <FileUpload
              id="idCard"
              accept=".jpg,.jpeg,.png,.pdf"
              value={formData.idCard}
              onChange={(file) => handleFileChange("idCard", file)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessLicense">
              ใบอนุญาตสถานประกอบการ <span className="text-red-500">*</span>
            </Label>
            <FileUpload
              id="businessLicense"
              accept=".jpg,.jpeg,.png,.pdf"
              value={formData.businessLicense}
              onChange={(file) => handleFileChange("businessLicense", file)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalLicense">
              ใบประกอบโรคศิลปะ <span className="text-red-500">*</span>
            </Label>
            <FileUpload
              id="professionalLicense"
              accept=".jpg,.jpeg,.png,.pdf"
              value={formData.professionalLicense}
              onChange={(file) => handleFileChange("professionalLicense", file)}
              required
            />
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateFormData({ acceptTerms: checked === true })}
              required
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="acceptTerms" className="text-sm font-normal">
                ยอมรับ{" "}
                <Link to="/terms" className="text-primary underline">
                  เงื่อนไขและข้อตกลง
                </Link>

              </Label>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          ย้อนกลับ
        </Button>
        <Button type="submit" onClick={onSubmit} disabled={!formData.acceptTerms}>
          ยืนยัน
        </Button>
      </div>
    </div>
  )
}


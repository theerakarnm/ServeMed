"use client"

import type React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { FormSection } from "../form-section"

interface BusinessInfoFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formData: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateFormData: (data: any) => void
  nextStep: () => void
}

export default function BusinessInfoForm({ formData, updateFormData, nextStep }: BusinessInfoFormProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">ข้อมูลธุรกิจ</h2>

      <FormSection title="ข้อมูลสถานประกอบการ">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
              placeholder="ชื่อ-นามสกุล"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">
              ชื่อสถานประกอบการ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessType"
              value={formData.businessType}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              placeholder="ชื่อสถานประกอบการ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessCategory">
              ลักษณะสถานประกอบการ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.businessCategory}
              onValueChange={(value) => updateFormData({ businessCategory: value })}
            >
              <SelectTrigger id="businessCategory">
                <SelectValue placeholder="เลือกลักษณะสถานประกอบการ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmacy">ร้านขายยา</SelectItem>
                <SelectItem value="clinic">คลินิก</SelectItem>
                <SelectItem value="hospital">โรงพยาบาล</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection title="ข้อมูลเพิ่มเติม">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => updateFormData({ taxId: e.target.value })}
              placeholder="เลขประจำตัวผู้เสียภาษี"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">วิชาชีพ</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => updateFormData({ profession: e.target.value })}
              placeholder="วิชาชีพ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">เลขที่ใบประกอบโรคศิลปะ</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
              placeholder="เลขที่ใบประกอบโรคศิลปะ"
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={handleNext}>
          ถัดไป
        </Button>
      </div>
    </div>
  )
}


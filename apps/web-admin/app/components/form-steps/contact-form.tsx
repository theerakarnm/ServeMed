"use client"

import type React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { FormSection } from "../form-section"

interface ContactFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formData: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
}

export default function ContactForm({ formData, updateFormData, nextStep, prevStep }: ContactFormProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">ข้อมูลติดต่อ</h2>

      <FormSection title="ข้อมูลการติดต่อ">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              โทร <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="เบอร์โทรศัพท์"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              อีเมล <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="อีเมล"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lineId">ไลน์ไอดี</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                @
              </span>
              <Input
                id="lineId"
                value={formData.lineId}
                onChange={(e) => updateFormData({ lineId: e.target.value })}
                placeholder="ไลน์ไอดี"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralSource">
              ท่านรู้จักมาจากไหน <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.referralSource}
              onValueChange={(value) => updateFormData({ referralSource: value })}
            >
              <SelectTrigger id="referralSource">
                <SelectValue placeholder="เลือกช่องทางที่รู้จัก" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="friend">เพื่อนแนะนำ</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          ย้อนกลับ
        </Button>
        <Button type="button" onClick={handleNext}>
          ถัดไป
        </Button>
      </div>
    </div>
  )
}


"use client"

import type React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { FormSection } from "../form-section"

interface AddressFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formData: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
}

export default function AddressForm({ formData, updateFormData, nextStep, prevStep }: AddressFormProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const handleUseMainAddress = (checked: boolean) => {
    updateFormData({ useMainAddress: checked })

    if (checked) {
      updateFormData({
        mailingAddress: formData.address,
        mailingProvince: formData.province,
        mailingDistrict: formData.district,
        mailingSubdistrict: formData.subdistrict,
        mailingPostalCode: formData.postalCode,
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">ข้อมูลที่อยู่</h2>

      <FormSection title="ที่อยู่">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              ที่อยู่ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="บ้านเลขที่/หมู่/ถนน"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">
                จังหวัด <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.province} onValueChange={(value) => updateFormData({ province: value })}>
                <SelectTrigger id="province">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                  <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                  <SelectItem value="pathumthani">ปทุมธานี</SelectItem>
                  {/* Add more provinces as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">
                อำเภอ <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.district} onValueChange={(value) => updateFormData({ district: value })}>
                <SelectTrigger id="district">
                  <SelectValue placeholder="เลือกอำเภอ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="district1">อำเภอ 1</SelectItem>
                  <SelectItem value="district2">อำเภอ 2</SelectItem>
                  <SelectItem value="district3">อำเภอ 3</SelectItem>
                  {/* Add more districts as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subdistrict">
                ตำบล <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.subdistrict} onValueChange={(value) => updateFormData({ subdistrict: value })}>
                <SelectTrigger id="subdistrict">
                  <SelectValue placeholder="เลือกตำบล" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subdistrict1">ตำบล 1</SelectItem>
                  <SelectItem value="subdistrict2">ตำบล 2</SelectItem>
                  <SelectItem value="subdistrict3">ตำบล 3</SelectItem>
                  {/* Add more subdistricts as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateFormData({ postalCode: e.target.value })}
                placeholder="รหัสไปรษณีย์"
                required
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="ที่อยู่จัดส่ง">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="useMainAddress" checked={formData.useMainAddress} onCheckedChange={handleUseMainAddress} />
            <Label htmlFor="useMainAddress">ใช้ที่อยู่เดียวกัน</Label>
          </div>

          {!formData.useMainAddress && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailingAddress">
                  ที่อยู่จัดส่ง <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={(e) => updateFormData({ mailingAddress: e.target.value })}
                  placeholder="บ้านเลขที่/หมู่/ถนน"
                  required={!formData.useMainAddress}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mailingProvince">
                    จังหวัด <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.mailingProvince}
                    onValueChange={(value) => updateFormData({ mailingProvince: value })}
                  >
                    <SelectTrigger id="mailingProvince">
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                      <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                      <SelectItem value="pathumthani">ปทุมธานี</SelectItem>
                      {/* Add more provinces as needed */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mailingDistrict">
                    อำเภอ <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.mailingDistrict}
                    onValueChange={(value) => updateFormData({ mailingDistrict: value })}
                  >
                    <SelectTrigger id="mailingDistrict">
                      <SelectValue placeholder="เลือกอำเภอ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="district1">อำเภอ 1</SelectItem>
                      <SelectItem value="district2">อำเภอ 2</SelectItem>
                      <SelectItem value="district3">อำเภอ 3</SelectItem>
                      {/* Add more districts as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mailingSubdistrict">
                    ตำบล <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.mailingSubdistrict}
                    onValueChange={(value) => updateFormData({ mailingSubdistrict: value })}
                  >
                    <SelectTrigger id="mailingSubdistrict">
                      <SelectValue placeholder="เลือกตำบล" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdistrict1">ตำบล 1</SelectItem>
                      <SelectItem value="subdistrict2">ตำบล 2</SelectItem>
                      <SelectItem value="subdistrict3">ตำบล 3</SelectItem>
                      {/* Add more subdistricts as needed */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mailingPostalCode">
                    รหัสไปรษณีย์ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mailingPostalCode"
                    value={formData.mailingPostalCode}
                    onChange={(e) => updateFormData({ mailingPostalCode: e.target.value })}
                    placeholder="รหัสไปรษณีย์"
                    required={!formData.useMainAddress}
                  />
                </div>
              </div>
            </div>
          )}
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


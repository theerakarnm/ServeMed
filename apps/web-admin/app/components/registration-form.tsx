"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import BusinessInfoForm from "./form-steps/business-info-form"
import AddressForm from "./form-steps/address-form"
import ContactForm from "./form-steps/contact-form"
import DocumentsForm from "./form-steps/documents-form"
import RegistrationComplete from "./form-steps/registration-complete"
import FormProgress from "./form-progress"

type FormData = {
  businessName: string
  businessType: string
  businessCategory: string
  taxId: string
  profession: string
  licenseNumber: string
  // Address
  address: string
  province: string
  district: string
  subdistrict: string
  postalCode: string
  // Same as above address
  useMainAddress: boolean
  mailingAddress: string
  mailingProvince: string
  mailingDistrict: string
  mailingSubdistrict: string
  mailingPostalCode: string
  // Contact
  phone: string
  email: string
  lineId: string
  referralSource: string
  // Documents
  idCard: File | null
  businessLicense: File | null
  professionalLicense: File | null
  // Terms
  acceptTerms: boolean
}

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    businessCategory: "",
    taxId: "",
    profession: "",
    licenseNumber: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    useMainAddress: false,
    mailingAddress: "",
    mailingProvince: "",
    mailingDistrict: "",
    mailingSubdistrict: "",
    mailingPostalCode: "",
    phone: "",
    email: "",
    lineId: "",
    referralSource: "",
    idCard: null,
    businessLicense: null,
    professionalLicense: null,
    acceptTerms: false,
  })

  const totalSteps = 4

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // Move to completion step
    setCurrentStep(totalSteps + 1)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {currentStep <= totalSteps && <FormProgress currentStep={currentStep} totalSteps={totalSteps} />}

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <BusinessInfoForm formData={formData} updateFormData={updateFormData} nextStep={nextStep} />
            )}

            {currentStep === 2 && (
              <AddressForm
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {currentStep === 3 && (
              <ContactForm
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {currentStep === 4 && (
              <DocumentsForm
                formData={formData}
                updateFormData={updateFormData}
                prevStep={prevStep}
                onSubmit={handleSubmit}
              />
            )}

            {currentStep === 5 && <RegistrationComplete />}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


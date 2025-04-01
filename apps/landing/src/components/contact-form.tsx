import type React from "react"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "@/utils/i18n"
import type { languages } from "@/i18n/ui"

export function ContactForm({ lang }: { lang: keyof typeof languages }) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle form submission here
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const t = useTranslations(lang as keyof typeof languages);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          {t("contact.form.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("contact.form.desc")}
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 h-[400px]">
          <CheckCircle className="h-16 w-16 text-[#1ab16d]" />
          <h3 className="text-xl font-semibold">Thank You!</h3>
          <p className="text-center text-muted-foreground">
            {t("common.we.will.get.back.to.you.shortly")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("common.first.name")}
              </Label>
              <Input id="firstName" placeholder="Enter your first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("common.last.name")}
              </Label>
              <Input id="lastName" placeholder="Enter your last name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t("common.email")}
            </Label>
            <Input id="email" type="email" placeholder="Enter your email address" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {t("common.phone")}
            </Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">
              {t("common.service.interested.in")}
            </Label>
            <Select>
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier">Become a Supplier</SelectItem>
                <SelectItem value="clinic">Register as a Clinic</SelectItem>
                <SelectItem value="distribution">Distribution Partnership</SelectItem>
                <SelectItem value="technology">Integration Solutions</SelectItem>
                <SelectItem value="consultation">Business Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {t("common.message")}
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us about your project or inquiry"
              className="min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#1ab16d] hover:bg-[#159b5d] text-white">
            {t("common.send.message")}
          </Button>
        </form>
      )}
    </div>
  )
}


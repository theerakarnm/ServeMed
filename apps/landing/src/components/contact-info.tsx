import type { languages } from "@/i18n/ui"
import { useTranslations } from "@/utils/i18n";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"

export function ContactInfo({ lang }: { lang: keyof typeof languages }) {
  const t = useTranslations(lang as keyof typeof languages);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          {t("contact.info.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("contact.info.desc")}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {t("contact.info.address")}
            </h3>
            <p className="text-muted-foreground">
              {t("contact.info.address1")}
            </p>
            <p className="text-muted-foreground">
              {t("contact.info.address2")}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {t('common.phone')}
            </h3>
            <p className="text-muted-foreground">
              {t('contact.info.phone.value')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {t('common.email')}
            </h3>
            <p className="text-muted-foreground">
              contact@servemed.co
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {t('contact.info.hours')}
            </h3>
            <p className="text-muted-foreground">
              {t('contact.info.hours.value').split('\n').map((line, index) => (
                <span key={line}>
                  {line}
                  {index < t('contact.info.hours.value').split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="font-semibold mb-4">
          {t('contact.info.connect')}
        </h3>
        <div className="flex space-x-4">
          <a href="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Instagram className="h-5 w-5 text-[#1ab16d]" />
          </a>
          <a href="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Facebook className="h-5 w-5 text-[#1ab16d]" />
          </a>
          <a href="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Twitter className="h-5 w-5 text-[#1ab16d]" />
          </a>
          <a href="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Linkedin className="h-5 w-5 text-[#1ab16d]" />
          </a>
        </div>
      </div>
    </div>
  )
}


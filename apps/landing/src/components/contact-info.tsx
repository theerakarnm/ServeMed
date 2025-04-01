import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">Reach out to us directly or visit our office.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">Our Medical Office</h3>
            <p className="text-muted-foreground">123 Healthcare Plaza</p>
            <p className="text-muted-foreground">New York, NY 10001</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">info@servemed.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="h-6 w-6 text-[#1ab16d] mt-0.5" />
          <div>
            <h3 className="font-semibold">Office Hours</h3>
            <p className="text-muted-foreground">Monday - Friday: 9am - 6pm</p>
            <p className="text-muted-foreground">Saturday: 10am - 4pm</p>
            <p className="text-muted-foreground">Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="font-semibold mb-4">Connect With Us</h3>
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


import type React from "react"
interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      {children}
    </div>
  )
}


import { CheckCircle } from "lucide-react"

interface FormProgressProps {
  currentStep: number
  totalSteps: number
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const steps = [
    { id: 1, name: "ข้อมูลธุรกิจ" },
    { id: 2, name: "ที่อยู่" },
    { id: 3, name: "ข้อมูลติดต่อ" },
    { id: 4, name: "เอกสาร" },
  ]

  return (
    <div className="py-4">
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.id < currentStep
                    ? "bg-primary border-primary text-white"
                    : step.id === currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {step.id < currentStep ? <CheckCircle className="w-6 h-6" /> : <span>{step.id}</span>}
              </div>
              <p className={`mt-2 text-sm ${step.id <= currentStep ? "text-primary font-medium" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden sm:flex items-center justify-center">
          <div className="w-full bg-gray-200 h-1">
            <div
              className="bg-primary h-1 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-primary">
          ขั้นตอนที่ {currentStep} จาก {totalSteps}: {steps[currentStep - 1].name}
        </p>
        <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}


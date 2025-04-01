import RegistrationForm from "~/components/registration-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="CNY Health Care" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary">สมัครสมาชิกสำหรับสถานประกอบการ</h1>
        </div>
        <RegistrationForm />
      </div>
    </main>
  )
}


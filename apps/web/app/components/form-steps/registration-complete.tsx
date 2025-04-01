import { CheckCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Link } from "@remix-run/react"

export default function RegistrationComplete() {
  return (
    <div className="py-8 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">ลงทะเบียนสำเร็จ</h2>
      <p className="text-muted-foreground mb-6">ขอบคุณสำหรับการลงทะเบียน เราจะตรวจสอบข้อมูลของท่านและติดต่อกลับโดยเร็วที่สุด</p>
      <div className="flex justify-center">
        <Link to="/">กลับสู่หน้าหลัก</Link>
      </div>
    </div>
  )
}


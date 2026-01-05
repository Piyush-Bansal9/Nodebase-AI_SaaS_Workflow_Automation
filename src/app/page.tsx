import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => {

  const something = true;
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button variant="outline">
        Click me
      </Button>
    </div>
  )
}

export default Page;
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function ManegUserDropdwoun() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] dark:hover:bg-white/10" variant="ghost">
            <EllipsisVertical className="size-4" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-fit px-4">
        
      </PopoverContent>
    </Popover>
  );
}

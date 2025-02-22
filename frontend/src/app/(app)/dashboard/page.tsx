import SwipeCards from "@/components/image-swipe";
import { TypographyH1 } from "@/components/typography/H1";

export default function DashboardPage() {

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <TypographyH1>FitSnap</TypographyH1>
      </div>
      <SwipeCards />
    </div>
  );
}

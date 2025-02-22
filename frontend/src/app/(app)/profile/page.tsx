import { ProfileHeader } from "@/components/profile-header";
import { ProfileContent } from "@/components/profile-content";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}

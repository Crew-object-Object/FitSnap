export function ProfileHeader() {
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-purple-900 h-72" />

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20 pb-32">
        <h1 className="text-4xl font-bold text-white mb-2">[username]</h1>
        <p className="text-lg text-white/80 mb-8">[BIO]</p>

        {/* Profile Image */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 rounded-full bg-rose-400 border-4 border-background" />
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-blue-900 text-white">
      {/* Full-width background */}
      <div className="px-4 py-6 flex flex-col md:flex-row justify-between items-center max-w-full">
        
        {/* Left: Links with offset for About & Privacy */}
        <div className="flex gap-4 mb-4 md:mb-0">
          <div className="flex gap-4 ml-6">
            <a href="/about" className="hover:underline">About</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </div>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/support" className="hover:underline">Support</a>
        </div>

        {/* Right: Copyright */}
        <div className="text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} Civix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

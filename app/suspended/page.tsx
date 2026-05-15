// app/suspended/page.tsx
export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4">Account Suspended</h1>
        <p className="text-gray-400 mb-6">
          Your account has been suspended due to repeated violations of the Velour
          Acceptable Use Policy. If you believe this is an error, contact us at{' '}
          <a href="mailto:support@velour.fm" className="text-purple-400 underline">
            support@velour.fm
          </a>.
        </p>
        <a href="/aup" className="text-sm text-gray-500 underline">
          View Acceptable Use Policy
        </a>
      </div>
    </div>
  )
}
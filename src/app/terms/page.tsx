import BackButton from "../components/BackButton";

export default function TermsPage() {
  return (
    <>
    <div className="m-4">
        <BackButton />
      </div>
    <div className="max-w-4xl mx-auto px-4 py-12">
     
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Terms and Conditions</h1>
      <div className="prose prose-lg dark:text-gray-400">
        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials (information or software) on this website for personal,
          non-commercial transitory viewing only.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">3. Disclaimer</h2>
        <p>
          The materials on this website are provided on an &apos;as is&apos; basis. We
          make no warranties, expressed or implied, and hereby disclaim and
          negate all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property or other
          violation of rights.

        </p>
      </div>
    </div>
    </>
  );
}

import BackButton from "../components/BackButton";

export default function PrivacyPage() {
  return (
    <>
      <div className="m-4">
        <BackButton />
      </div>
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
      <div className="prose prose-lg dark:text-gray-400">
        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">
          Information We Collect
        </h2>
        <p>
          We collect information that you provide directly to us, information we
          obtain automatically when you use our platform, and information from
          third-party sources.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">
          How We Use Your Information
        </h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, to develop new ones, and to protect our platform and our
          users.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">
          Information Sharing and Disclosure
        </h2>
        <p>
          We do not share your personal information with companies,
          organizations, or individuals outside of our company except in the
          following cases:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>With your consent</li>
          <li>For legal reasons</li>
          <li>To protect rights and safety</li>
        </ul>
      </div>
    </div>
    </>
  );
}

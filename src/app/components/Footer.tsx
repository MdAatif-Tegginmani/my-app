import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t dark:bg-gray-800 w-full dark:border-[#474a66]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <Link
              href="/about"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

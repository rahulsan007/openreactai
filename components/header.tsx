import Image from "next/image";
import GithubIcon from "@/components/icons/github-icon";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center py-6 px-10 bg-gray-900 text-white shadow-lg">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold">
        <BrainCircuit className="h-6 w-6 text-blue-400" /> {/* Adjusted for dark mode */}
        <span>OpenReactAi</span>
      </Link>

      <div className="absolute right-3">
        <a
          href=""
          target="_blank"
          className="ml-auto hidden items-center gap-3 rounded-2xl bg-gray-800 px-6 py-2 text-white shadow sm:flex hover:bg-gray-700 transition"
        >
          <GithubIcon className="h-4 w-4 text-white" />
          <span>GitHub Repo</span>
        </a>
      </div>
    </header>
  );
}

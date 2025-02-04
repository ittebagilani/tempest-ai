import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { buttonVariants } from "./ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Tornado } from "lucide-react";
import MobileNav from "./mobile-nav";

const Navbar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Tornado className="h-6 w-6 text-pink-500 mr-2" />
            <span>tempest ai.</span>
          </Link>

          <MobileNav />

          <div className="hidden items-center space-x-4 sm:flex">
            <SignedOut>
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <SignInButton>
                  <button
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </button>
                </SignUpButton>
              </>
            </SignedOut>

            <SignedIn>
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            </SignedIn>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;

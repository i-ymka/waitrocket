import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <SignUp />
    </main>
  );
}

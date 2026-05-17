import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function SignUpPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/settings");
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-2xl text-center">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {dictionary.auth.signUpPage.eyebrow}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {dictionary.auth.signUpPage.title}
        </h1>
      </div>
      <AuthForm mode="sign-up" dictionary={dictionary.auth.form} />
    </main>
  );
}

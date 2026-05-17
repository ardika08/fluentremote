import { redirect } from "next/navigation";

import { DevBackendLab } from "@/components/dev-backend-lab";
import { getServerSession, isAdminEmail } from "@/lib/auth-server";

export default async function DevBackendPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          Dev Backend
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Internal sandbox for FluentRemote backend routes.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
          Use this page to verify activation, preferences persistence, and provider-backed
          translation from the browser while wiring Postgres and Better Auth.
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
          Signed in as <span className="font-semibold">{session.user.email}</span>
        </p>
      </div>

      <DevBackendLab />
    </main>
  );
}

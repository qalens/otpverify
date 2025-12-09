import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  const payload = verifyToken(token!);
  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
    redirect('/auth/login');
  }

  const userId = (payload as any).userId;

  const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (userResult.length === 0) {
    redirect('/auth/login');
  }

  const user = userResult[0] as any;
  if (!user.verified) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome back, {user.firstName} {user.lastName} ({user.email})</p>
        <form method="post" action="/api/auth/logout" className="mt-6">
          <button type="submit" className="px-4 py-2 rounded bg-sky-600 text-white">Logout</button>
        </form>
      </div>
    </main>
  );
}

import 'server-only';

import './globals.css';
import SupabaseListener from '../components/supabase-listener';
import createClient from '../utils/supabase-server';

export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html>
      <head />
      <body>
        <SupabaseListener accessToken={session?.access_token} />
        {children}
      </body>
    </html>
  );
}

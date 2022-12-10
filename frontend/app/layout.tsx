import 'server-only';

import '../styles/globals.css'

import SupabaseListener from '../components/supabase-listener';
import createClient from '../utils/supabase-server';

import VerbelNavbar from '../components/navbar';
import VerbelFooter from '../components/footer';


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html>
      <head />
      <body>
        <SupabaseListener accessToken={session?.access_token} />

        <VerbelNavbar/>

        {children}

        {/* <VerbelFooter/> */}
      </body>
    </html>
  );
}

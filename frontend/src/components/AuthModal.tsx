import { supabase } from "../lib/supabaseClient";

export default function AuthModal({ role, onClose }) {

  const login = async (email, password) => {
    await supabase.auth.signInWithPassword({ email, password })
  }

  const signup = async (email, password) => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      {/* email/password form */}
    </div>
  )
}

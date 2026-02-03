const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://csqbjmiksmmgvzoiwnzv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9jwooU5Rx6FOeQBp7hAn-g_XVDGjZyM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
    const email = "admin.renttruth@gmail.com";
    const password = "R3nT2001tRutH1989";

    console.log(`Probando login para: ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("❌ FALLO DE LOGIN:");
        console.error("Mensaje:", error.message);
        console.error("Status:", error.status);

        if (error.message.includes("Email not confirmed")) {
            console.log("\n💡 CAUSA PROBABLE: Tu proyecto de Supabase requiere confirmar el email.");
            console.log("SOLUCIÓN: Ve a Supabase > Authentication > Users, busca el usuario, pulsa en los tres puntos (...) y selecciona 'Confirm user' (si existe la opción) o desactiva 'Confirm email' en Settings.");
        }
    } else {
        console.log("✅ LOGIN EXITOSO. Las credenciales son correctas.");
        console.log("Si falla en la web, es un problema de la página, no del usuario.");
        console.log("Usuario ID:", data.user.id);
    }
}

testLogin();

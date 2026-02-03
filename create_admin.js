const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://csqbjmiksmmgvzoiwnzv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9jwooU5Rx6FOeQBp7hAn-g_XVDGjZyM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminUser() {
    const email = "renttruth@gmail.com";
    const password = "R3nT2001tRutH1989";
    const name = "Admin RentTruth";

    console.log(`Intentando registrar usuario: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                role: 'ADMIN' // We try to request ADMIN role, but RLS/Triggers might ignore it
            }
        }
    });

    if (error) {
        console.error("Error al crear usuario:", error.message);
        return;
    }

    if (data.user) {
        console.log("✅ Usuario creado con éxito!");
        console.log("ID:", data.user.id);
        console.log("Email:", data.user.email);
        console.log("\n⚠️ ATENCIÓN: Por seguridad, el rol 'ADMIN' no se asigna automáticamente.");
        console.log("👉 Ve a tu panel de Supabase > Table Editor > profiles");
        console.log(`👉 Busca el usuario '${email}' y cambia manualmente su rol a 'ADMIN'.`);
    }
}

createAdminUser();

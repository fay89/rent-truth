const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://csqbjmiksmmgvzoiwnzv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9jwooU5Rx6FOeQBp7hAn-g_XVDGjZyM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixAdminProfile() {
    const email = "renttruth@gmail.com";
    const password = "R3nT2001tRutH1989";

    console.log(`🔌 Conectando como ${email}...`);

    // 1. Iniciar Sesión para tener permisos RLS
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        console.error("❌ Error de Login:", authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log("✅ Login correcto. ID:", userId);

    // 2. Comprobar si existe el perfil y borrarlo para recrearlo limpio (o actualizarlo)
    //    A veces es más fácil un 'upsert'
    console.log("🛠️  Reparando perfil en base de datos...");

    const { data: profileCheck, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (profileCheck) {
        console.log("ℹ️  El perfil ya existe. Actualizando a ADMIN...");
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                role: 'ADMIN',
                name: 'Admin RentTruth'
            })
            .eq('id', userId);

        if (updateError) console.error("❌ Falló la actualización:", updateError.message);
        else console.log("✅ Perfil actualizado a ADMIN correctamente.");

    } else {
        console.log("⚠️ El perfil NO existe (el trigger falló antes). Creándolo manualmente...");
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                name: 'Admin RentTruth',
                role: 'ADMIN' // Ahora el constraint debería permitirlo
            });

        if (insertError) {
            console.error("❌ Falló la creación:", insertError.message);
        } else {
            console.log("✅ Perfil ADMIN creado desde cero.");
        }
    }
}

fixAdminProfile();

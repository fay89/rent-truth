const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://csqbjmiksmmgvzoiwnzv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9jwooU5Rx6FOeQBp7hAn-g_XVDGjZyM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkRole() {
    const email = "renttruth@gmail.com";
    const password = "R3nT2001tRutH1989";

    console.log(`🔍 Inspeccionando usuario: ${email}`);

    // 1. Auth Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        console.error("❌ Auth Error:", authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log(`✅ Auth ID: ${userId}`);

    // 2. Fetch Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error("❌ Profile Error:", profileError.message);
        return;
    }

    console.log("\n📊 DATOS EN BASE DE DATOS:");
    console.log("---------------------------");
    console.log(`Email: ${profile.email}`);
    console.log(`Role:  "${profile.role}"`); // Quotes to see exact string
    console.log(`Name:  ${profile.name}`);
    console.log("---------------------------");

    if (profile.role === 'ADMIN') {
        console.log("✅ El rol es CORRECTO en la base de datos.");
        console.log("Si la web falla, es porque la web tiene una versión antigua cacheada o el código local no se ha recargado.");
    } else {
        console.log("❌ El rol es INCORRECTO. Debería ser 'ADMIN'.");
        console.log("POSIBLE CAUSA: Algún trigger o la web lo sobrescribió al hacer login.");
    }
}

checkRole();

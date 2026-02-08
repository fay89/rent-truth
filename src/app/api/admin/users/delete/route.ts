import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Admin Client (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function DELETE(request: Request) {
    try {
        try {
            // 1. Verify Authentication & Authorization
            // Get the token from the Authorization header
            const authHeader = request.headers.get('Authorization');
            if (!authHeader) {
                return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
            }
            const token = authHeader.replace('Bearer ', '');

            // Verify validity of the token
            const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

            if (userError || !user) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }
            if (!authHeader) {
                return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
            }
            const token = authHeader.replace('Bearer ', '');

            const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

            if (userError || !user) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }

            // 2. Check if requester is ADMIN
            // We query the profiles table using the Admin Client (fast and reliable)
            const { data: requesterProfile } = await supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (requesterProfile?.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
            }

            // 3. Get Target User ID from Body
            const body = await request.json();
            const { userId } = body;

            if (!userId) {
                return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
            }

            // 4. Perform Deletion (Auth + Database)
            // Deleting from Auth usually cascades to public tables if set up, 
            // otherwise we delete manually.
            const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

            if (deleteAuthError) {
                console.error("Error deleting auth user:", deleteAuthError);
                return NextResponse.json({ error: deleteAuthError.message }, { status: 500 });
            }

            // Optional: Ensure profile is deleted (if cascade is missing)
            const { error: deleteProfileError } = await supabaseAdmin
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (deleteProfileError) {
                console.warn("Profile deletion warning:", deleteProfileError);
                // Verify if it's "row not found" which is fine (cascade worked)
            }

            return NextResponse.json({ success: true, message: 'User deleted permanently' });

        } catch (error: any) {
            console.error("API Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

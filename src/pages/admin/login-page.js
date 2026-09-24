import { supabase } from '../../lib/supabase.js';
import { renderLogin } from './login.js';

/* /login — signs in and goes to the panel; an existing session goes straight there. */
const toPanel = () => location.replace('admin.html');
const { data: { session } } = await supabase.auth.getSession();
if (session) toPanel();
else renderLogin(document.getElementById('admin'), { onSuccess: toPanel });

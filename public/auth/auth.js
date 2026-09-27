// Shared sign-in for hayashi.in apps, backed by Supabase Auth.
//
// Include after the pinned Supabase library:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js"
//           integrity="sha384-Rj26LVGvoeRVR6+mwQmFfcR3QOBEwT+ZmuCWpuiqeTzJpCs0ER4ITAWGb4Hiy3Ok"
//           crossorigin="anonymous"></script>
//   <script src="/auth/auth.js"></script>
//
// Every app lives on the same origin, so one sign-in covers all of them. The
// project URL and publishable key below are public by design; the app's API
// checks the user's token against the project's public keys. Never put a
// Supabase secret key in this repo.

(function () {
	const SUPABASE_URL = "https://eshvpijmfbplqviiolms.supabase.co";
	const SUPABASE_KEY = "sb_publishable_EC_pNJbJVxt2DjqnqoPmhw_xibo3THk";
	const LOGIN_PATH = "/login/";
	const PROVIDERS = [
		["google", "Google"],
		["github", "GitHub"],
	];

	if (!window.supabase?.createClient) {
		console.error("auth.js: load the Supabase library first");
		return;
	}
	const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
		auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
	});

	// Only same-site paths are allowed as a return address.
	function safeNext(next) {
		return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
	}

	function returnUrl(next) {
		return `${location.origin}${LOGIN_PATH}?next=${encodeURIComponent(safeNext(next))}`;
	}

	window.hayashiAuth = {
		client,

		async session() {
			const { data } = await client.auth.getSession();
			return data.session || null;
		},

		async user() {
			return (await this.session())?.user || null;
		},

		// A fresh access token for Authorization: Bearer, or null when signed out.
		async token() {
			return (await this.session())?.access_token || null;
		},

		loginUrl(next = location.pathname + location.search) {
			return `${LOGIN_PATH}?next=${encodeURIComponent(safeNext(next))}`;
		},

		safeNext,

		// Which of Google / GitHub / email are switched on in the project.
		async providers() {
			try {
				const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY } });
				const settings = await res.json();
				const on = PROVIDERS.filter(([id]) => settings.external?.[id]);
				return { oauth: on, email: Boolean(settings.external?.email) };
			} catch {
				return { oauth: PROVIDERS, email: true };
			}
		},

		signInWith(provider, next) {
			return client.auth.signInWithOAuth({ provider, options: { redirectTo: returnUrl(next) } });
		},

		emailLink(email, next) {
			return client.auth.signInWithOtp({ email, options: { emailRedirectTo: returnUrl(next) } });
		},

		signOut() {
			return client.auth.signOut();
		},

		onChange(callback) {
			return client.auth.onAuthStateChange((_event, session) => callback(session?.user || null));
		},

		// A short label for a user: their name from Google/GitHub, else their email.
		label(user) {
			const m = user?.user_metadata || {};
			return m.full_name || m.name || m.user_name || user?.email || "your account";
		},
	};
})();

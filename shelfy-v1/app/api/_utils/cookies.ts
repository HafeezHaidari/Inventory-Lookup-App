// Node-only helpers to handle multiple Set-Cookie headers
export function getSetCookies(res: Response): string[] {
    // @ts-expect-error headers.raw() is Node-fetch specific
    const raw = res.headers.raw?.();
    if (raw && Array.isArray(raw['set-cookie'])) return raw['set-cookie'];
    const single = res.headers.get('set-cookie');
    return single ? [single] : [];
}

// Rewrite backend cookies to the frontend origin:
// - drop Domain (so it defaults to inventory-index.com)
// - enforce Secure; HttpOnly; Path=/
// - keep/normalize SameSite=Lax (good for same-site navigation)
export function rehostSetCookieForFrontend(sc: string): string {
    // remove any explicit Domain
    sc = sc.replace(/;\s*Domain=[^;]+/i, '');
    // normalize SameSite to Lax (or change if you need cross-site embeds)
    sc = sc.replace(/;\s*SameSite=[^;]+/i, '');
    if (!/;\s*SameSite=/i.test(sc)) sc += '; SameSite=Lax';

    // ensure Secure, HttpOnly, Path=/
    if (!/;\s*Secure/i.test(sc)) sc += '; Secure';
    if (!/;\s*HttpOnly/i.test(sc)) sc += '; HttpOnly';
    if (!/;\s*Path=/i.test(sc)) sc += '; Path=/';

    return sc;
}

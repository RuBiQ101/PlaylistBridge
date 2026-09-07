# Security Policy

## 🔒 Security Architecture in PlaylistBridge

PlaylistBridge is designed with **zero-trust security principles** and strict client/server data isolation:

1. **OAuth 2.0 Authorization Code Flow**:
   - Access tokens are exchanged securely server-side and never exposed to raw client bundles.
   - Granular, least-privilege OAuth scopes:
     - Google/YouTube: `youtube.readonly` (Read-only access).
     - Spotify: `playlist-read-private`, `playlist-modify-public`, `playlist-modify-private`, `user-library-modify`.

2. **Encrypted Session State (AES-256-GCM)**:
   - Session tokens are encrypted with `aes-256-gcm` using standard authenticated encryption with dynamic initialization vectors (IVs) and authentication tags.
   - HttpOnly, SameSite cookies prevent client-side JavaScript access (XSS mitigation).

3. **No Persistent Token Storage**:
   - Tokens exist only for the duration of the active session and are never written to any third-party database or persistent cloud storage.

4. **Automated Secret Scanning & CI/CD Auditing**:
   - Continuous GitHub Actions workflow scans pull requests and commits for dependency vulnerabilities and accidental credential leaks.

---

## 🛡️ Supported Versions

| Version | Supported |
| :--- | :--- |
| 1.0.x | ✅ Supported |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability within PlaylistBridge:

1. **Do not create a public GitHub Issue.**
2. Please report the issue privately by opening a [GitHub Security Advisory](https://github.com/RuBiQ101/PlaylistBridge/security/advisories) or contacting the maintainers directly.
3. Include detailed steps to reproduce the issue, expected behavior, and potential impact.

We take security issues seriously and will respond promptly to investigate and patch reported vulnerabilities.

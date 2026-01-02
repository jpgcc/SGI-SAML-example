# SGI SAML Identity Provider (Demo)

A client-side SAML 2.0 Identity Provider for testing and educational purposes. This demo IdP manages identities with `@sgi.example` email addresses.

**Live Demo:** https://jpgcc.github.io/SGI-SAML-example/

> **Warning:** This is a demo IdP for testing purposes only. The private keys are publicly visible and provide no real security. Do not use in production environments.

## Features

- Browser-based SAML 2.0 Identity Provider
- Pre-configured test users with `@sgi.example` domain
- Generates valid SAML 2.0 responses
- Supports both IdP-initiated and SP-initiated (basic) flows
- Provides standard SAML attributes (email, name, role, etc.)
- Deployable on GitHub Pages (static hosting)

## Test Users

The following demo users are available (any password works):

| Email | Name | Role | Department |
|-------|------|------|------------|
| admin@sgi.example | Alice Admin | admin | IT Administration |
| bob@sgi.example | Bob Builder | developer | Engineering |
| carol@sgi.example | Carol Chen | manager | Product Management |
| dave@sgi.example | Dave Davis | user | Marketing |
| eve@sgi.example | Eve Evans | analyst | Data Analytics |
| frank@sgi.example | Frank Foster | guest | External |

Any `@sgi.example` email address will be accepted - if not in the list above, a generic user profile will be created.

## IdP Configuration Details

Use these values when configuring your Service Provider:

| Setting | Value |
|---------|-------|
| **Entity ID / Issuer** | `https://jpgcc.github.io/SGI-SAML-example/metadata.xml` |
| **SSO URL (HTTP-Redirect)** | `https://jpgcc.github.io/SGI-SAML-example/index.html` |
| **SSO URL (HTTP-POST)** | `https://jpgcc.github.io/SGI-SAML-example/index.html` |
| **Metadata URL** | `https://jpgcc.github.io/SGI-SAML-example/metadata.xml` |
| **NameID Format** | `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress` |
| **Signature Algorithm** | RSA-SHA256 |

## Configuring Your Service Provider

### Step 1: Import IdP Metadata

Most Service Providers allow you to import IdP metadata directly. Download or point to:

```
https://jpgcc.github.io/SGI-SAML-example/metadata.xml
```

### Step 2: Manual Configuration (if metadata import unavailable)

If your SP doesn't support metadata import, configure these settings manually:

1. **IdP Entity ID:** `https://jpgcc.github.io/SGI-SAML-example/metadata.xml`

2. **IdP SSO URL:** `https://jpgcc.github.io/SGI-SAML-example/index.html`

3. **IdP Certificate:** Download from the metadata or copy from `js/crypto.js`

4. **NameID Format:** Email Address (`urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`)

### Step 3: Configure Attribute Mapping

The IdP sends the following SAML attributes:

| Attribute Name | Description | Example Value |
|----------------|-------------|---------------|
| `email` | User's email address | alice@sgi.example |
| `firstName` | User's first name | Alice |
| `lastName` | User's last name | Admin |
| `displayName` | User's full display name | Alice Admin |
| `role` | User's role | admin |
| `department` | User's department | IT Administration |

Standard claim URIs are also provided:
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`

### Step 4: Provide SP Information to IdP

When using the demo IdP, you'll need to enter:

1. **ACS URL (Assertion Consumer Service URL):** The URL where your SP receives SAML responses
2. **SP Entity ID:** Your SP's unique identifier (often the same as metadata URL)

## Usage Flows

### IdP-Initiated Flow

1. Visit https://jpgcc.github.io/SGI-SAML-example/
2. Sign in with a test user (e.g., `admin@sgi.example`, any password)
3. Enter your SP's ACS URL and Entity ID
4. Click "Generate SAML Response"
5. Click "POST to Service Provider" to send the response

### SP-Initiated Flow (Basic Support)

The IdP accepts SAMLRequest parameters via URL query string:

```
https://jpgcc.github.io/SGI-SAML-example/index.html?SAMLRequest=<base64-encoded-request>&RelayState=<optional-relay-state>
```

The IdP will attempt to parse the request and pre-fill the ACS URL and Entity ID.

## Example SP Configurations

### Generic SAML SP

```yaml
idp:
  entity_id: https://jpgcc.github.io/SGI-SAML-example/metadata.xml
  sso_url: https://jpgcc.github.io/SGI-SAML-example/index.html
  certificate: |
    MIIDXTCCAkWgAwIBAgIJAJC1Hk9VmwlnMA0GCSqGSIb3DQEBCwUAMEUx...
  name_id_format: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
```

### passport-saml (Node.js)

```javascript
const samlStrategy = new SamlStrategy({
  entryPoint: 'https://jpgcc.github.io/SGI-SAML-example/index.html',
  issuer: 'your-sp-entity-id',
  cert: fs.readFileSync('./idp-certificate.pem', 'utf8'),
  // Note: This demo IdP uses unsigned responses in practice
  wantAssertionsSigned: false,
  signatureAlgorithm: 'sha256'
});
```

### Spring Security SAML

```xml
<bean id="idpMetadata" class="org.springframework.security.saml.metadata.ExtendedMetadataDelegate">
    <constructor-arg>
        <bean class="org.opensaml.saml2.metadata.provider.HTTPMetadataProvider">
            <constructor-arg value="https://jpgcc.github.io/SGI-SAML-example/metadata.xml"/>
            <constructor-arg value="5000"/>
        </bean>
    </constructor-arg>
</bean>
```

## Limitations

This is a **demo/testing** IdP with the following limitations:

1. **No Real Security:** Private keys are public; signatures are not cryptographically valid
2. **No Session Management:** Sessions are stored in browser sessionStorage only
3. **Basic SP-Initiated Support:** SAMLRequest parsing is simplified
4. **No Single Logout (SLO):** Logout only clears local session
5. **No Encryption:** SAML assertions are not encrypted
6. **Client-Side Only:** All processing happens in the browser

For production use, consider:
- [Keycloak](https://www.keycloak.org/)
- [Okta](https://www.okta.com/)
- [Auth0](https://auth0.com/)
- [Azure AD](https://azure.microsoft.com/en-us/services/active-directory/)
- [SimpleSAMLphp](https://simplesamlphp.org/)

## Local Development

To run locally:

1. Clone this repository
2. Serve the files with any static HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve

   # Using PHP
   php -S localhost:8000
   ```
3. Open http://localhost:8000 in your browser

## Deploying Your Own Instance

### GitHub Pages

1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main` branch
4. Update `metadata.xml` with your GitHub Pages URL
5. Your IdP will be available at `https://<username>.github.io/<repo-name>/`

### Other Static Hosts

Deploy to any static hosting service (Netlify, Vercel, Cloudflare Pages, etc.):

1. Upload all files
2. Update `metadata.xml` with your deployment URL
3. Ensure the hosting serves `.xml` files with correct MIME type

## File Structure

```
SGI-SAML-example/
├── index.html          # Main IdP interface
├── metadata.xml        # SAML IdP metadata
├── README.md           # This file
├── css/
│   └── style.css       # Styling
└── js/
    ├── app.js          # Main application logic
    ├── crypto.js       # Demo certificates and crypto utilities
    └── saml.js         # SAML response generator
```

## License

MIT License - Use freely for testing and educational purposes.

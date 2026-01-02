/**
 * SAML 2.0 Response Generator for SGI Demo IdP
 * WARNING: This is for demo/testing purposes only!
 */

const SAMLGenerator = {
    // SAML 2.0 namespace URIs
    NS: {
        SAML: 'urn:oasis:names:tc:SAML:2.0:assertion',
        SAMLP: 'urn:oasis:names:tc:SAML:2.0:protocol',
        DS: 'http://www.w3.org/2000/09/xmldsig#',
        XS: 'http://www.w3.org/2001/XMLSchema',
        XSI: 'http://www.w3.org/2001/XMLSchema-instance'
    },

    // Generate complete SAML Response
    generateResponse: async function(options) {
        const {
            issuer,
            destination,
            audience,
            nameId,
            attributes,
            sessionIndex
        } = options;

        const responseId = DemoCrypto.generateId();
        const assertionId = DemoCrypto.generateId();
        const issueInstant = DemoCrypto.getTimestamp();
        const notBefore = DemoCrypto.getTimestampWithOffset(-5); // 5 minutes ago
        const notOnOrAfter = DemoCrypto.getTimestampWithOffset(60); // 60 minutes from now
        const sessionNotOnOrAfter = DemoCrypto.getTimestampWithOffset(480); // 8 hours from now

        // Build the assertion
        const assertion = this.buildAssertion({
            assertionId,
            issueInstant,
            issuer,
            nameId,
            audience,
            destination,
            notBefore,
            notOnOrAfter,
            sessionIndex: sessionIndex || DemoCrypto.generateId(),
            sessionNotOnOrAfter,
            attributes
        });

        // Build the complete response
        const response = this.buildResponse({
            responseId,
            issueInstant,
            destination,
            issuer,
            assertion
        });

        return response;
    },

    // Build SAML Response wrapper
    buildResponse: function(options) {
        const { responseId, issueInstant, destination, issuer, assertion } = options;

        return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:Response xmlns:samlp="${this.NS.SAMLP}"
    xmlns:saml="${this.NS.SAML}"
    ID="${responseId}"
    Version="2.0"
    IssueInstant="${issueInstant}"
    Destination="${destination}">
    <saml:Issuer>${issuer}</saml:Issuer>
    <samlp:Status>
        <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
    </samlp:Status>
${assertion}
</samlp:Response>`;
    },

    // Build SAML Assertion
    buildAssertion: function(options) {
        const {
            assertionId,
            issueInstant,
            issuer,
            nameId,
            audience,
            destination,
            notBefore,
            notOnOrAfter,
            sessionIndex,
            sessionNotOnOrAfter,
            attributes
        } = options;

        // Build attribute statements
        let attributeStatements = '';
        if (attributes && Object.keys(attributes).length > 0) {
            const attrXml = Object.entries(attributes).map(([name, value]) => {
                return `            <saml:Attribute Name="${this.escapeXml(name)}" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
                <saml:AttributeValue xmlns:xsi="${this.NS.XSI}" xmlns:xs="${this.NS.XS}" xsi:type="xs:string">${this.escapeXml(value)}</saml:AttributeValue>
            </saml:Attribute>`;
            }).join('\n');

            attributeStatements = `        <saml:AttributeStatement>
${attrXml}
        </saml:AttributeStatement>`;
        }

        // Generate demo signature
        const signatureValue = btoa(assertionId + issueInstant + nameId).substring(0, 172) + '==';
        const digestValue = btoa(assertionId).substring(0, 28) + '==';

        return `    <saml:Assertion xmlns:saml="${this.NS.SAML}"
        ID="${assertionId}"
        Version="2.0"
        IssueInstant="${issueInstant}">
        <saml:Issuer>${issuer}</saml:Issuer>
        <ds:Signature xmlns:ds="${this.NS.DS}">
            <ds:SignedInfo>
                <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
                <ds:Reference URI="#${assertionId}">
                    <ds:Transforms>
                        <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
                        <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                    </ds:Transforms>
                    <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                    <ds:DigestValue>${digestValue}</ds:DigestValue>
                </ds:Reference>
            </ds:SignedInfo>
            <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
            <ds:KeyInfo>
                <ds:X509Data>
                    <ds:X509Certificate>${DemoCrypto.getCertificateForMetadata()}</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </ds:Signature>
        <saml:Subject>
            <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">${this.escapeXml(nameId)}</saml:NameID>
            <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
                <saml:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}" Recipient="${destination}"/>
            </saml:SubjectConfirmation>
        </saml:Subject>
        <saml:Conditions NotBefore="${notBefore}" NotOnOrAfter="${notOnOrAfter}">
            <saml:AudienceRestriction>
                <saml:Audience>${this.escapeXml(audience)}</saml:Audience>
            </saml:AudienceRestriction>
        </saml:Conditions>
        <saml:AuthnStatement AuthnInstant="${issueInstant}" SessionIndex="${sessionIndex}" SessionNotOnOrAfter="${sessionNotOnOrAfter}">
            <saml:AuthnContext>
                <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
            </saml:AuthnContext>
        </saml:AuthnStatement>
${attributeStatements}
    </saml:Assertion>`;
    },

    // Escape XML special characters
    escapeXml: function(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    },

    // Parse SAML AuthnRequest (basic parsing for demo)
    parseAuthnRequest: function(base64Request) {
        try {
            // Decode base64
            let xml = atob(base64Request);

            // Try to inflate if it's deflated (simplified - real impl would use pako)
            // For demo, we'll just try to parse as-is

            // Extract basic info using regex (simplified)
            const issuerMatch = xml.match(/<(?:saml:|saml2:)?Issuer[^>]*>([^<]+)<\/(?:saml:|saml2:)?Issuer>/);
            const acsMatch = xml.match(/AssertionConsumerServiceURL="([^"]+)"/);
            const idMatch = xml.match(/ID="([^"]+)"/);

            return {
                issuer: issuerMatch ? issuerMatch[1] : null,
                assertionConsumerServiceURL: acsMatch ? acsMatch[1] : null,
                id: idMatch ? idMatch[1] : null,
                raw: xml
            };
        } catch (e) {
            console.error('Error parsing AuthnRequest:', e);
            return null;
        }
    },

    // Base64 encode the response for POST binding
    encodeResponse: function(xmlResponse) {
        return btoa(unescape(encodeURIComponent(xmlResponse)));
    }
};

// Export for use in other modules
window.SAMLGenerator = SAMLGenerator;

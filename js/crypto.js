/**
 * Demo cryptographic utilities for SGI SAML IdP
 * WARNING: These keys are PUBLIC and for demo purposes only!
 */

const DemoCrypto = {
    // Demo RSA Private Key (PKCS#8 format) - DO NOT USE IN PRODUCTION
    // Generated specifically for this demo - publicly visible
    privateKeyPem: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7o2GZPW5MPXAU
aqHKOCH8ZV3gUZFh0Jk4n4z8qT6D9qXx5V2LdL3HGwHrY4M8f5w6Z8E7NWk0bW3f
9m8K3Z5S8H7z5F1W2J6T9F0X3Q8G7H1Y5V2U4W3R6E9D8C0B7A1Z2Y3X4W5V6U7
T8R9Q0P1O2N3M4L5K6J7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5P6O7N8
M9L0K1J2H3G4F5E6D7C8B9A0Z1Y2X3W4V5U6T7S8R9Q0P1O2N3M4L5K6J7H8G9
F0E1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5P6O7N8M9L0K1J2H3G4F5E6D7C8B9A0
Z1Y2X3W4V5U6T7S8R9Q0P1O2N3M4L5K6J7H8G9F0E1D2C3B4A5Z6Y7X8W9V0U1
T2S3R4Q5P6AgMBAAECggEABj3u8ql5z7d8K2Y1V4W3X0Z9Q8P7O6N5M4L3K2J1
H0G9F8E7D6C5B4A3Z2Y1X0W9V8U7T6S5R4Q3P2O1N0M9L8K7J6H5G4F3E2D1C0
B9A8Z7Y6X5W4V3U2T1S0R9Q8P7O6N5M4L3K2J1H0G9F8E7D6C5B4A3Z2Y1X0W9
V8U7T6S5R4Q3P2O1N0M9L8K7J6H5G4F3E2D1C0B9A8Z7Y6X5W4V3U2T1S0R9Q8
P7O6N5M4L3K2J1H0G9F8E7D6C5B4A3Z2Y1X0W9V8U7T6S5R4Q3P2O1N0M9L8K7
J6H5G4F3E2D1C0B9A8Z7Y6X5W4V3U2T1S0R9Q8P7O6N5M4L3K2J1H0G9F8E7D6
C5B4A3Z2Y1X0W9V8U7T6S5R4Q3P2O1N0M9L8K7J6H5G4F3E2D1C0B9A8Z7Y6X5
W4V3U2T1S0QKBgQDz8Q7F6E5D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6
K5J4H3G2F1E0D9C8B7A6Z5Y4X3W2V1U0T9S8R7Q6P5O4N3M2L1K0J9H8G7F6E5
D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4H3G2F1E0D9C8B7A6Z5Y4
X3W2V1U0QKBgQDEr1D2C3B4A5Z6Y7X8W9V0U1T2S3R4Q5P6O7N8M9L0K1J2H3
G4F5E6D7C8B9A0Z1Y2X3W4V5U6T7S8R9Q0P1O2N3M4L5K6J7H8G9F0E1D2C3B4
A5Z6Y7X8W9V0U1T2S3R4Q5P6O7N8M9L0K1J2H3G4F5E6D7C8B9A0Z1Y2X3W4V5
U6T7S8R9Q0QKBgQCbN8M7L6K5J4H3G2F1E0D9C8B7A6Z5Y4X3W2V1U0T9S8R7
Q6P5O4N3M2L1K0J9H8G7F6E5D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6
K5J4H3G2F1E0D9C8B7A6Z5Y4X3W2V1U0T9S8R7Q6P5O4N3M2L1K0J9H8G7F6E5
D4C3B2A1QKBgH7G8F9E0D1C2B3A4Z5Y6X7W8V9U0T1S2R3Q4P5O6N7M8L9K0J1
H2G3F4E5D6C7B8A9Z0Y1X2W3V4U5T6S7R8Q9P0O1N2M3L4K5J6H7G8F9E0D1C2
B3A4Z5Y6X7W8V9U0T1S2R3Q4P5O6N7M8L9K0J1H2G3F4E5D6C7B8A9Z0Y1X2W3
V4U5T6S7QKBgC1J0K9L8M7N6O5P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8G7
H6J5K4L3M2N1O0P9Q8R7S6T5U4V3W2X1Y0Z9A8B7C6D5E4F3G2H1J0K9L8M7N6
O5P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8G7H6J5K4L3M2N1O0P9Q8R7S6T5
U4V3W2X1
-----END PRIVATE KEY-----`,

    // Demo X.509 Certificate
    certificate: `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAJC1Hk9VmwlnMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAlVTMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhTR0kgRGVtbyBJ
ZGVudGl0eSBQcm92aWRlcjAeFw0yNDAxMDEwMDAwMDBaFw0zNDAxMDEwMDAwMDBa
MEUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhT
R0kgRGVtbyBJZGVudGl0eSBQcm92aWRlcjCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBALujYZk9bkw9cBRqoco4IfxlXeBRkWHQmTifjPypPoP2pfHlXYt0
vccbAetjgzx/nDpnwTs1aTRtbd/2bwrdnlLwfvPkXVbYnpP0XRfdDwbsfVjlXZTh
bdHoT0PwLQHsDVn9WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1
WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1
WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1
WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9Vn1WfVZ9VkCAwEAAaNQME4wHQYDVR0OBBYE
FBH+XY6tD1ND6QOdP3BRmQSsBYzdMB8GA1UdIwQYMBaAFBH+XY6tD1ND6QOdP3BR
mQSsBYzdMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBADemoSignature
ExampleOnlyNotRealSignatureDataHereForDemoPurposesOnlyDoNotUse123456789
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789Plus
SignatureExample==
-----END CERTIFICATE-----`,

    // Certificate for metadata (without headers)
    getCertificateForMetadata: function() {
        return this.certificate
            .replace('-----BEGIN CERTIFICATE-----', '')
            .replace('-----END CERTIFICATE-----', '')
            .replace(/\n/g, '')
            .trim();
    },

    // Generate a random ID
    generateId: function() {
        const chars = 'abcdef0123456789';
        let id = '_';
        for (let i = 0; i < 32; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    },

    // Get current timestamp in ISO format
    getTimestamp: function() {
        return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    },

    // Get timestamp with offset in minutes
    getTimestampWithOffset: function(offsetMinutes) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + offsetMinutes);
        return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
    },

    // Simple Base64 encode
    base64Encode: function(str) {
        return btoa(unescape(encodeURIComponent(str)));
    },

    // Simple Base64 decode
    base64Decode: function(str) {
        return decodeURIComponent(escape(atob(str)));
    },

    // SHA-256 hash (returns hex string)
    sha256: async function(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Generate a demo signature (not cryptographically valid)
    // For demo purposes, we generate a consistent but fake signature
    generateDemoSignature: async function(content) {
        const hash = await this.sha256(content);
        // Create a fake but consistent signature based on the hash
        // This is NOT cryptographically secure - demo only
        return this.base64Encode(hash + hash.split('').reverse().join(''));
    }
};

// Export for use in other modules
window.DemoCrypto = DemoCrypto;

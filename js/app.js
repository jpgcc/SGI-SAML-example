/**
 * SGI SAML Identity Provider - Demo Application
 */

const SGIIdP = {
    // Hardcoded test users
    users: {
        'admin@sgi.example': {
            email: 'admin@sgi.example',
            firstName: 'Alice',
            lastName: 'Admin',
            displayName: 'Alice Admin',
            role: 'admin',
            department: 'IT Administration'
        },
        'bob@sgi.example': {
            email: 'bob@sgi.example',
            firstName: 'Bob',
            lastName: 'Builder',
            displayName: 'Bob Builder',
            role: 'developer',
            department: 'Engineering'
        },
        'carol@sgi.example': {
            email: 'carol@sgi.example',
            firstName: 'Carol',
            lastName: 'Chen',
            displayName: 'Carol Chen',
            role: 'manager',
            department: 'Product Management'
        },
        'dave@sgi.example': {
            email: 'dave@sgi.example',
            firstName: 'Dave',
            lastName: 'Davis',
            displayName: 'Dave Davis',
            role: 'user',
            department: 'Marketing'
        },
        'eve@sgi.example': {
            email: 'eve@sgi.example',
            firstName: 'Eve',
            lastName: 'Evans',
            displayName: 'Eve Evans',
            role: 'analyst',
            department: 'Data Analytics'
        },
        'frank@sgi.example': {
            email: 'frank@sgi.example',
            firstName: 'Frank',
            lastName: 'Foster',
            displayName: 'Frank Foster',
            role: 'guest',
            department: 'External'
        }
    },

    // Current authenticated user
    currentUser: null,

    // IdP configuration
    config: {
        entityId: null,
        ssoUrl: null,
        metadataUrl: null
    },

    // Initialize the application
    init: function() {
        // Set up configuration based on current URL
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
        this.config.entityId = baseUrl + '/metadata.xml';
        this.config.ssoUrl = baseUrl + '/index.html';
        this.config.metadataUrl = baseUrl + '/metadata.xml';

        // Update UI with IdP info
        document.getElementById('idp-entity-id').textContent = this.config.entityId;
        document.getElementById('idp-sso-url').textContent = this.config.ssoUrl;
        const metadataLink = document.getElementById('idp-metadata-url');
        metadataLink.href = this.config.metadataUrl;
        metadataLink.textContent = this.config.metadataUrl;

        // Set up event listeners
        this.setupEventListeners();

        // Check for SAMLRequest in URL (SP-initiated flow)
        this.handleSAMLRequest();

        // Check for stored session
        this.restoreSession();
    },

    // Set up event listeners
    setupEventListeners: function() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Generate SAML Response button
        document.getElementById('generate-response').addEventListener('click', () => {
            this.generateSAMLResponse();
        });

        // Copy to clipboard button
        document.getElementById('copy-response').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Logout button
        document.getElementById('logout').addEventListener('click', () => {
            this.handleLogout();
        });
    },

    // Handle login
    handleLogin: function() {
        const email = document.getElementById('email').value.trim().toLowerCase();
        const errorDiv = document.getElementById('login-error');

        // Validate email domain
        if (!email.endsWith('@sgi.example')) {
            errorDiv.textContent = 'Email must be an @sgi.example address';
            errorDiv.style.display = 'block';
            return;
        }

        // Check if user exists (or create ad-hoc user for any @sgi.example email)
        let user = this.users[email];
        if (!user) {
            // Create ad-hoc user for any @sgi.example email
            const localPart = email.split('@')[0];
            user = {
                email: email,
                firstName: localPart.charAt(0).toUpperCase() + localPart.slice(1),
                lastName: 'User',
                displayName: localPart.charAt(0).toUpperCase() + localPart.slice(1) + ' User',
                role: 'user',
                department: 'General'
            };
        }

        // Set current user
        this.currentUser = user;

        // Store session
        sessionStorage.setItem('sgi_idp_user', JSON.stringify(user));

        // Hide error, show authenticated section
        errorDiv.style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('authenticated-section').style.display = 'block';
        document.getElementById('user-email').textContent = user.email;
    },

    // Handle logout
    handleLogout: function() {
        this.currentUser = null;
        sessionStorage.removeItem('sgi_idp_user');

        // Reset UI
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('authenticated-section').style.display = 'none';
        document.getElementById('saml-response-section').style.display = 'none';
        document.getElementById('login-form').reset();
    },

    // Restore session from storage
    restoreSession: function() {
        const stored = sessionStorage.getItem('sgi_idp_user');
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('authenticated-section').style.display = 'block';
                document.getElementById('user-email').textContent = this.currentUser.email;
            } catch (e) {
                console.error('Error restoring session:', e);
            }
        }
    },

    // Handle incoming SAML AuthnRequest
    handleSAMLRequest: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const samlRequest = urlParams.get('SAMLRequest');
        const relayState = urlParams.get('RelayState');

        if (samlRequest) {
            try {
                const parsed = SAMLGenerator.parseAuthnRequest(samlRequest);
                if (parsed) {
                    // Pre-fill SP information
                    if (parsed.assertionConsumerServiceURL) {
                        document.getElementById('sp-acs-url').value = parsed.assertionConsumerServiceURL;
                    }
                    if (parsed.issuer) {
                        document.getElementById('sp-entity-id').value = parsed.issuer;
                    }

                    // Store RelayState
                    if (relayState) {
                        sessionStorage.setItem('sgi_idp_relay_state', relayState);
                    }

                    console.log('Parsed SAML AuthnRequest:', parsed);
                }
            } catch (e) {
                console.error('Error parsing SAMLRequest:', e);
            }
        }
    },

    // Generate SAML Response
    generateSAMLResponse: async function() {
        if (!this.currentUser) {
            alert('Please sign in first');
            return;
        }

        const acsUrl = document.getElementById('sp-acs-url').value.trim();
        const spEntityId = document.getElementById('sp-entity-id').value.trim();

        if (!acsUrl) {
            alert('Please enter the Service Provider ACS URL');
            return;
        }

        if (!spEntityId) {
            alert('Please enter the Service Provider Entity ID');
            return;
        }

        try {
            // Generate SAML Response
            const response = await SAMLGenerator.generateResponse({
                issuer: this.config.entityId,
                destination: acsUrl,
                audience: spEntityId,
                nameId: this.currentUser.email,
                attributes: {
                    'email': this.currentUser.email,
                    'firstName': this.currentUser.firstName,
                    'lastName': this.currentUser.lastName,
                    'displayName': this.currentUser.displayName,
                    'role': this.currentUser.role,
                    'department': this.currentUser.department,
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': this.currentUser.email,
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': this.currentUser.firstName,
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': this.currentUser.lastName,
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': this.currentUser.displayName
                }
            });

            // Base64 encode the response
            const encodedResponse = SAMLGenerator.encodeResponse(response);

            // Update UI
            document.getElementById('saml-response-output').value = encodedResponse;
            document.getElementById('saml-response-hidden').value = encodedResponse;

            // Set form action to ACS URL
            const form = document.getElementById('saml-post-form');
            form.action = acsUrl;

            // Set RelayState if available
            const relayState = sessionStorage.getItem('sgi_idp_relay_state') || '';
            form.querySelector('[name="RelayState"]').value = relayState;

            // Show response section
            document.getElementById('saml-response-section').style.display = 'block';

            console.log('Generated SAML Response:', response);
        } catch (e) {
            console.error('Error generating SAML Response:', e);
            alert('Error generating SAML Response: ' + e.message);
        }
    },

    // Copy response to clipboard
    copyToClipboard: function() {
        const textarea = document.getElementById('saml-response-output');
        textarea.select();
        document.execCommand('copy');

        // Visual feedback
        const button = document.getElementById('copy-response');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SGIIdP.init();
});

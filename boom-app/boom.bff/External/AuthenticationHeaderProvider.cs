using System.Net.Http.Headers;

namespace boom.bff
{
    /// <summary>
    /// Setting Authorization headers according to the used protocol. 
    /// </summary>
    public class AuthenticationHeaderProvider
    {
        /// Authentication header value that stores the authentication details.
        public readonly AuthenticationHeaderValue? AuthHeader;
        /// <summary>
        /// Checks the provided Token and applies it to the header value.
        /// </summary>
        /// <param name="token">Authentication token</param>
        public AuthenticationHeaderProvider(string? token)
        {
            if (!string.IsNullOrWhiteSpace(token))
            {
                AuthHeader = new AuthenticationHeaderValue("Token", token);
            }
        }

        /// <summary>
        /// Checks if Authentication header is setup correctly and adds Authentication header to the HTTP request headers.
        /// </summary>
        /// <param name="headers">HTTP request headers object</param>
        /// <exception cref="Exception">Throws Exception if Authentication header value is not setup</exception>
        public void ApplyAuthorizationHeader(HttpRequestHeaders headers)
        {
            if (AuthHeader == null)
            {
                throw new Exception("Setting up a proxy failed. A token or clientId/clientSecret combination should be provided");
            }
            headers.Authorization = AuthHeader;
        }
    }
}

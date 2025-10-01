using System.Net.Http.Headers;

namespace boom.bff
{
    public class AuthenticationHeaderProvider
    {
        public readonly AuthenticationHeaderValue? AuthHeader;
        public AuthenticationHeaderProvider(string? token)
        {
            if (!string.IsNullOrWhiteSpace(token))
            {
                AuthHeader = new AuthenticationHeaderValue("Token", token);
            }
        }

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

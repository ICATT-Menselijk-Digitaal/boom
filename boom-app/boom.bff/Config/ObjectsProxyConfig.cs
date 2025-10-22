using System.Net.Http.Headers;
using Yarp.ReverseProxy.Transforms;

namespace boom.bff
{
    /// <summary>
    /// Extension methods for registering the objects proxy route with the dependency injection container.
    /// </summary>
    public static class ObjectsExtensions
    {
        /// <summary>
        /// Registers an <see cref="ObjectsProxyConfig"/> instance as an <see cref="IBoomProxyRoute"/>.
        /// </summary>
        /// <param name="services">The service collection to modify.</param>
        /// <param name="destination">The base destination URL for the objects API. Example: "https://api.example.com/".</param>
        /// <param name="token">The API token used to authorize requests to the objects API.</param>
        /// <returns>The updated service collection.</returns>
        public static IServiceCollection AddObjectsProxy(this IServiceCollection services, string destination, string token)
            => services.AddSingleton<IBoomProxyRoute>(new ObjectsProxyConfig(destination, token));
    }

    /// <summary>
    /// Sets configuration and performs request transformations for the objects proxy route.
    /// </summary>
    public class ObjectsProxyConfig : IBoomProxyRoute
    {
        private readonly AuthenticationHeaderProvider _authHeaderProvider;

        /// <summary>
        /// Initializes a new instance of <see cref="ObjectsProxyConfig"/>.
        /// </summary>
        /// <param name="destination">The base destination URL for the objects API.</param>
        /// <param name="token">The API token to use for authorization.</param>
        public ObjectsProxyConfig(string destination, string token)
        {
            Destination = destination;

            _authHeaderProvider = new AuthenticationHeaderProvider(token);
        }

        /// <inheritdoc/>
        public string Route => "objects/{**remainder}";

        /// <inheritdoc/>
        public string Destination { get; }

        /// <summary>
        /// Applies request transforms for the objects route. This method will set authorization headers,
        /// remove cookies, and for POST requests ensure the correct content headers are present.
        /// </summary>
        /// <param name="context">The YARP request transform context.</param>
        /// <returns>A completed <see cref="ValueTask"/>.</returns>
        public ValueTask ApplyRequestTransform(RequestTransformContext context)
        {
            ApplyAuthHeaders(context.ProxyRequest.Headers);
            if (context.ProxyRequest.Method == HttpMethod.Post)
            {
                // In case of a post request, some extra content headers are needed.
                if (context.ProxyRequest.Content != null)
                {
                    ApplyPostHeaders(context.ProxyRequest.Content.Headers);
                }
            }
            return new();
        }

        /// <summary>
        /// Applies authorization and cleans up disallowed headers from the proxied request.
        /// </summary>
        /// <param name="headers">The request headers to modify.</param>
        public void ApplyAuthHeaders(HttpRequestHeaders headers)
        {
            _authHeaderProvider.ApplyAuthorizationHeader(headers);
            headers.Remove("Cookie");
        }

        /// <summary>
        /// Applies post-specific content headers required by the objects API.
        /// </summary>
        /// <param name="headers">The content headers to modify.</param>
        public void ApplyPostHeaders(HttpContentHeaders headers)
        {
            headers.ContentType = new MediaTypeHeaderValue("application/json");
            headers.Add("Content-Crs", "EPSG:4326");
        }
    }
}


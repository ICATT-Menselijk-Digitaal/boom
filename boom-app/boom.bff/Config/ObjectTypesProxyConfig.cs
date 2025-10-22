using System.Net.Http.Headers;
using Yarp.ReverseProxy.Transforms;

namespace boom.bff
{
    /// <summary>
    /// Extension methods for registering the object types proxy route.
    /// </summary>
    public static class ObjectTypesExtensions
    {
        /// <summary>
        /// Registers an <see cref="ObjectTypesProxyConfig"/> instance as an <see cref="IBoomProxyRoute"/>.
        /// </summary>
        /// <param name="services">The service collection to modify.</param>
        /// <param name="destination">The base destination URL for the object types API.</param>
        /// <param name="token">The API token used to authorize requests to the object types API.</param>
        /// <returns>The updated service collection.</returns>
        public static IServiceCollection AddObjectTypesProxy(this IServiceCollection services, string destination, string token)
            => services.AddSingleton<IBoomProxyRoute>(new ObjectTypesProxyConfig(destination, token));
    }

    /// <summary>
    /// Configuration and request transforms for the object types proxy route.
    /// </summary>
    public class ObjectTypesProxyConfig : IBoomProxyRoute
    {
        private readonly AuthenticationHeaderProvider _authHeaderProvider;

        /// <summary>
        /// Initializes a new instance of <see cref="ObjectTypesProxyConfig"/>.
        /// </summary>
        /// <param name="destination">The destination base URL for the object types API.</param>
        /// <param name="token">The API token to use for authorization.</param>
        public ObjectTypesProxyConfig(string destination, string token)
        {
            Destination = destination;

            _authHeaderProvider = new AuthenticationHeaderProvider(token);
        }

        /// <inheritdoc/>
        public string Route => "objecttypes/{**remainder}";

        /// <inheritdoc/>
        public string Destination { get; }

        /// <summary>
        /// Applies request transforms for the object types route. Currently this sets
        /// authorization headers and removes cookies from the forwarded request.
        /// </summary>
        /// <param name="context">The YARP request transform context.</param>
        /// <returns>A completed <see cref="ValueTask"/>.</returns>
        public ValueTask ApplyRequestTransform(RequestTransformContext context)
        {
            ApplyHeaders(context.ProxyRequest.Headers);
            return new();
        }

        /// <summary>
        /// Applies standard headers (authorization and cookie removal) to a proxied request.
        /// </summary>
        /// <param name="headers">The headers collection to modify.</param>
        public void ApplyHeaders(HttpRequestHeaders headers)
        {
            _authHeaderProvider.ApplyAuthorizationHeader(headers);
            headers.Remove("Cookie");
        }
    }


}


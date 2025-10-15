using Microsoft.Extensions.Primitives;
using System.Net.Http.Headers;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace boom.bff
{
    /// <summary>
    /// Contract for a proxy route used by the BFF to register YARP clusters and routes.
    /// Implementations provide the route path, destination address and any request transforms.
    /// </summary>
    public interface IBoomProxyRoute
    {
        /// <summary>
        /// The route path used by YARP for matching upstream requests. Example: "objecttypes/{**remainder}".
        /// </summary>
        string Route { get; }

        /// <summary>
        /// The destination base address for the cluster.
        /// </summary>
        string Destination { get; }

        /// <summary>
        /// Applies request transforms for the route. Implementers can mutate headers and content.
        /// </summary>
        /// <param name="context">The YARP request transform context.</param>
        ValueTask ApplyRequestTransform(RequestTransformContext context);
    }

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

    /// <summary>
    /// Provides a simple proxy configuration for YARP based on registered <see cref="IBoomProxyRoute"/> instances.
    /// The provider constructs RouteConfig and ClusterConfig objects at startup so YARP can route traffic to the
    /// configured backend services.
    /// </summary>
    public class ProxyConfigProvider : IProxyConfigProvider
    {
        private readonly SimpleProxyConfig _config;

        /// <summary>
        /// Creates a new <see cref="ProxyConfigProvider"/> using the provided proxy routes.
        /// </summary>
        /// <param name="proxyRoutes">The collection of routes to expose through YARP.</param>
        public ProxyConfigProvider(IEnumerable<IBoomProxyRoute> proxyRoutes)
        {
            var allRoutes = new List<RouteConfig>();
            var clusters = new List<ClusterConfig>();

            foreach (var proxyRoute in proxyRoutes)
            {
                clusters.Add(new ClusterConfig
                {
                    ClusterId = proxyRoute.Route,
                    Destinations = new Dictionary<string, DestinationConfig>
                    {
                        [proxyRoute.Route] = new DestinationConfig
                        {
                            Address = proxyRoute.Destination
                        }
                    },
                });
                allRoutes.Add(new RouteConfig
                {
                    RouteId = proxyRoute.Route,
                    ClusterId = proxyRoute.Route,
                    Match = new RouteMatch { Path = proxyRoute.Route.Trim('/') },
                });
            }

            _config = new SimpleProxyConfig(allRoutes, clusters);
        }

        /// <inheritdoc/>
        public IProxyConfig GetConfig() => _config;

        private class SimpleProxyConfig : IProxyConfig
        {
            private readonly CancellationTokenSource _cts = new();

            public SimpleProxyConfig(IReadOnlyList<RouteConfig> routes, IReadOnlyList<ClusterConfig> clusters)
            {
                Routes = routes ?? throw new ArgumentNullException(nameof(routes));
                Clusters = clusters ?? throw new ArgumentNullException(nameof(clusters));
                ChangeToken = new CancellationChangeToken(_cts.Token);
            }

            /// <inheritdoc/>
            public IReadOnlyList<RouteConfig> Routes { get; }

            /// <inheritdoc/>
            public IReadOnlyList<ClusterConfig> Clusters { get; }

            /// <inheritdoc/>
            public IChangeToken ChangeToken { get; }
        }
    }

    /// <summary>
    /// A transform provider that delegates per-route request transformations to the matching <see cref="IBoomProxyRoute"/> implementation.
    /// </summary>
    public class ObjectsTransformProvider : ITransformProvider
    {
        private readonly IBoomProxyRoute[] _proxyRoutes;

        /// <summary>
        /// Initializes a new instance of <see cref="ObjectsTransformProvider"/>.
        /// </summary>
        /// <param name="proxyRoutes">The available proxy routes to consider when applying transforms.</param>
        public ObjectsTransformProvider(IEnumerable<IBoomProxyRoute> proxyRoutes)
        {
            _proxyRoutes = proxyRoutes.ToArray();
        }

        /// <inheritdoc/>
        public void Apply(TransformBuilderContext context)
        {
            var match = _proxyRoutes.FirstOrDefault(x => x.Route == context?.Cluster?.ClusterId);
            if (match != null)
            {
                context.AddRequestTransform(match.ApplyRequestTransform);
            }
        }

        /// <inheritdoc/>
        public void ValidateCluster(TransformClusterValidationContext context)
        {
        }

        /// <inheritdoc/>
        public void ValidateRoute(TransformRouteValidationContext context)
        {
        }
    }
}


using Microsoft.Extensions.Primitives;
using System.Net.Http.Headers;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace boom.bff
{
    public interface IBoomProxyRoute
    {
        string Route { get; }
        string Destination { get; }

        ValueTask ApplyRequestTransform(RequestTransformContext context);
    }
    public static class ObjectTypesExtensions
    {
        public static IServiceCollection AddObjectTypesProxy(this IServiceCollection services, string destination, string token)
            => services.AddSingleton<IBoomProxyRoute>(new ObjectTypesProxyConfig(destination, token));
    }
    public class ObjectTypesProxyConfig : IBoomProxyRoute
    {
        private readonly AuthenticationHeaderProvider _authHeaderProvider;

        public ObjectTypesProxyConfig(string destination, string token)
        {
            Destination = destination;

            _authHeaderProvider = new AuthenticationHeaderProvider(token);
        }

        public string Route => "objecttypes/{**remainder}";

        public string Destination { get; }


        public ValueTask ApplyRequestTransform(RequestTransformContext context)
        {
            ApplyHeaders(context.ProxyRequest.Headers);
            return new();
        }

        public void ApplyHeaders(HttpRequestHeaders headers)
        {
            _authHeaderProvider.ApplyAuthorizationHeader(headers);
        }
    }

    public class ProxyConfigProvider : IProxyConfigProvider
    {
        private readonly SimpleProxyConfig _config;

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

            public IReadOnlyList<RouteConfig> Routes { get; }

            public IReadOnlyList<ClusterConfig> Clusters { get; }

            public IChangeToken ChangeToken { get; }
        }
    }

    public class ObjectsTransformProvider : ITransformProvider
    {
        private readonly IBoomProxyRoute[] _proxyRoutes;

        public ObjectsTransformProvider(IEnumerable<IBoomProxyRoute> proxyRoutes)
        {
            _proxyRoutes = proxyRoutes.ToArray();
        }

        public void Apply(TransformBuilderContext context)
        {
            var match = _proxyRoutes.FirstOrDefault(x => x.Route == context?.Cluster?.ClusterId);
            if (match != null)
            {
                context.AddRequestTransform(match.ApplyRequestTransform);
            }
        }

        public void ValidateCluster(TransformClusterValidationContext context)
        {
        }

        public void ValidateRoute(TransformRouteValidationContext context)
        {
        }
    }
}


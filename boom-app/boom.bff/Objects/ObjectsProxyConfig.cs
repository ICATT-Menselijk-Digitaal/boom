using Microsoft.Extensions.Primitives;
using System.Net.Http.Headers;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace boom.bff
{
    public static class ObjectsExtensions
    {
        public static IServiceCollection AddObjectsProxy(this IServiceCollection services, string destination, string token)
            => services.AddSingleton<IBoomProxyRoute>(new ObjectsProxyConfig(destination, token));
    }
    public class ObjectsProxyConfig : IBoomProxyRoute
    {
        private readonly AuthenticationHeaderProvider _authHeaderProvider;

        public ObjectsProxyConfig(string destination, string token)
        {
            Destination = destination;

            _authHeaderProvider = new AuthenticationHeaderProvider(token);
        }

        public string Route => "objects/{**remainder}";

        public string Destination { get; }


        public ValueTask ApplyRequestTransform(RequestTransformContext context)
        {
            ApplyAuthHeaders(context.ProxyRequest.Headers);
            if (context.ProxyRequest.Method == HttpMethod.Post) {
                // In case of a post request, some extra content headers are needed.
                ApplyPostHeaders(context.ProxyRequest.Content.Headers);
            }
            return new();
        }

        public void ApplyAuthHeaders(HttpRequestHeaders headers)
        {
            _authHeaderProvider.ApplyAuthorizationHeader(headers);
        }

        public void ApplyPostHeaders(HttpContentHeaders headers)
        {
            headers.ContentType = new MediaTypeHeaderValue("application/json");
            headers.Add("Content-Crs", "EPSG:4326");
        }
    }
}


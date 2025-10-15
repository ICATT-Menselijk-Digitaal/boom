using System;
using boom.bff;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms.Builder;

var builder = WebApplication.CreateBuilder(args);

// Yarp reverse proxy
builder.Services.AddReverseProxy();
builder.Services.AddSingleton<IProxyConfigProvider, ProxyConfigProvider>();
builder.Services.AddSingleton<ITransformProvider, ObjectsTransformProvider>();

// Read configuration values and only register proxies when both destination and token are present.
var objectTypesBaseUrl = builder.Configuration["OBJECTTYPES_BASE_URL"];
var objectTypesApiKey = builder.Configuration["OBJECTTYPES_API_KEY"];
if (!string.IsNullOrWhiteSpace(objectTypesBaseUrl) && !string.IsNullOrWhiteSpace(objectTypesApiKey))
{
    builder.Services.AddObjectTypesProxy(objectTypesBaseUrl, objectTypesApiKey);
}
else
{
    Console.WriteLine("Warning: OBJECTTYPES_BASE_URL or OBJECTTYPES_API_KEY is missing. ObjectTypes proxy will not be registered.");
}

var objectsBaseUrl = builder.Configuration["OBJECTS_BASE_URL"];
var objectsApiKey = builder.Configuration["OBJECTS_API_KEY"];
if (!string.IsNullOrWhiteSpace(objectsBaseUrl) && !string.IsNullOrWhiteSpace(objectsApiKey))
{
    builder.Services.AddObjectsProxy(objectsBaseUrl, objectsApiKey);
}
else
{
    Console.WriteLine("Warning: OBJECTS_BASE_URL or OBJECTS_API_KEY is missing. Objects proxy will not be registered.");
}

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapReverseProxy();

app.Run();

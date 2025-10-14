using boom.bff;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms.Builder;

var builder = WebApplication.CreateBuilder(args);

// Yarp reverse proxy
builder.Services.AddReverseProxy();
builder.Services.AddSingleton<IProxyConfigProvider, ProxyConfigProvider>();
builder.Services.AddSingleton<ITransformProvider, ObjectsTransformProvider>();
builder.Services.AddObjectTypesProxy(builder.Configuration["OBJECTTYPES_BASE_URL"], builder.Configuration["OBJECTTYPES_API_KEY"]);
builder.Services.AddObjectsProxy(builder.Configuration["OBJECTS_BASE_URL"], builder.Configuration["OBJECTS_API_KEY"]);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapReverseProxy();

app.Run();

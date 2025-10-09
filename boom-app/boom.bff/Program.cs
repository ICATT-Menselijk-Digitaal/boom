using boom.bff;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

// Yarp reverse proxy
builder.Services.AddReverseProxy();
builder.Services.AddSingleton<IProxyConfigProvider, ProxyConfigProvider>();
builder.Services.AddSingleton<ITransformProvider, ObjectsTransformProvider>();
builder.Services.AddObjectTypesProxy(builder.Configuration["ObjectTypes:Base_URL"], builder.Configuration["ObjectTypes:API_Key"]);
builder.Services.AddObjectsProxy(builder.Configuration["Objects:Base_URL"], builder.Configuration["Objects:API_Key"]);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseAuthorization();
app.MapReverseProxy();
//app.MapControllers();

//app.MapFallbackToFile("/index.html");

app.Run();

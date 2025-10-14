FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app
EXPOSE 8080

FROM node:lts-alpine AS frontend
WORKDIR /src
COPY package*.json .
RUN npm ci
COPY . .

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS dotnetbuild
WORKDIR /src
COPY ["boom.bff/boom.bff.csproj", "boom.bff/"]
RUN dotnet restore "boom.bff/boom.bff.csproj"
COPY boom.bff boom.bff
WORKDIR /src/boom.bff
RUN dotnet build "boom.bff.csproj" -c Release -o /src/build

FROM frontend AS frontendbuild
RUN npm run build

FROM dotnetbuild AS dotnetpublish
WORKDIR "/src/boom.bff"
RUN dotnet publish "boom.bff.csproj" -c Release -o /src/publish

FROM base AS final
WORKDIR /app
COPY --from=dotnetpublish /src/publish .
COPY --from=frontendbuild /src/dist ./wwwroot
ENTRYPOINT ["dotnet", "boom.bff.dll"]
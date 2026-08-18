# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. Copy project files from their subfolders
COPY ["TaskFlow.API/TaskFlow.API.csproj", "TaskFlow.API/"]
COPY ["TaskFlow.Core/TaskFlow.Core.csproj", "TaskFlow.Core/"]
COPY ["TaskFlow.Data/TaskFlow.Data.csproj", "TaskFlow.Data/"]

# 2. Restore dependencies for the API project
RUN dotnet restore "TaskFlow.API/TaskFlow.API.csproj"

# 3. Copy the rest of the source code and publish
COPY . .
WORKDIR "/src/TaskFlow.API"
RUN dotnet publish "TaskFlow.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TaskFlow.API.dll"]
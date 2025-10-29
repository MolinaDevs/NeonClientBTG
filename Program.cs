var builder = WebApplication.CreateBuilder(args);

// Carregar configurações do appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Sobrescrever com variáveis de ambiente (para segurança)
builder.Configuration.AddEnvironmentVariables();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adicionar CORS para permitir chamadas de outros domínios (SALAJuris)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure to listen on port 5000
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

var app = builder.Build();

// Habilitar arquivos estáticos (HTML, CSS, JS)
app.UseStaticFiles();

// Habilitar CORS
app.UseCors("AllowAll");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Página padrão (redirecionar para integração NEON)
app.MapGet("/", () => Results.Redirect("/integracao-neon-criar-tarefas.html"));

app.MapControllers();

app.Run();

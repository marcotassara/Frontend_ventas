# Frontend Despachos

Aplicación web para gestionar órdenes de compra y despacho. Desarrollada en React con Vite, contenedorizada con Docker y desplegada en AWS EC2.

## Tecnologías

- React 18 + Vite
- Tailwind CSS
- Docker multi-stage (Node 20 → Nginx)
- GitHub Actions
- AWS EC2

## Ejecución local

Requisitos: Docker Desktop instalado.

Crear archivo `.env` basado en `.env.example`:

```
BACKEND_HOST=host.docker.internal
DOCKERHUB_USERNAME=tu_usuario
```

Levantar:

```bash
docker compose up --build
```

Acceder en `http://localhost`

## Dockerfile

Usa build multi-stage:
- Etapa 1: compila el proyecto con Node 20 Alpine
- Etapa 2: sirve los archivos estáticos con Nginx Alpine

El usuario del contenedor no es root, siguiendo buenas prácticas de seguridad.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `BACKEND_HOST` | IP o hostname del servidor backend |
| `DOCKERHUB_USERNAME` | Usuario de Docker Hub para publicar imagen |

## Nginx

Nginx actúa como proxy inverso hacia el backend:
- `/api/v1/ventas` → `BACKEND_HOST:8080`
- `/api/v1/despachos` → `BACKEND_HOST:8081`
- Todo lo demás sirve el frontend React

## Pipeline CI/CD

El workflow `.github/workflows/ci-cd.yml` se activa con push a la rama `deploy`:

1. Construye la imagen Docker del frontend
2. Publica la imagen en Docker Hub con tags `latest` y `sha`
3. Copia `docker-compose.prod.yml` a la instancia EC2
4. Conecta por SSH y levanta el contenedor con la nueva imagen

## Despliegue en EC2

La instancia EC2 frontend debe tener Docker instalado. El pipeline maneja el despliegue automáticamente al hacer push a `deploy`.

Secrets requeridos en GitHub:
- `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`
- `EC2_FRONTEND_HOST` / `EC2_BACKEND_HOST`
- `EC2_USER` / `EC2_SSH_KEY`

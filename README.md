# Aplicación de quiz en Tiempo Real con React y Node.js

## Estructura general

```mermaid
graph TD
A[Frontend React] -->|WebSockets| B[Backend Node.js]
B --> C[Redis Pub/Sub]
C --> D[Participantes Móviles]
A -->|QR Code| D
D -->|WebSockets| B
```

### Componentes Clave a Implementar

#### 1. Backend (Nuevo servicio)

**Tecnologías:** Node.js + Express + Socket.IO + Redis

**Funcionalidades:**

- Manejar salas de quiz
- Comunicación en tiempo real
- Sincronización de estado
- Temporizadores

**Endpoints:**

- `POST /session` → Crear nueva sesión
- `GET /session/:id` → Obtener estado de sesión

#### 2. Redis Structure

```
// Sala de espera
"sessions:waiting:{sessionId}": Set de participantes

// Estado del quiz
"sessions:active:{sessionId}": {
  "currentQuestion": 0,
  "timeRemaining": 30,
  "status": "playing" // waiting, playing, finished
}

// Respuestas
"answers:{sessionId}:{questionIndex}": Hash {
  "participantId1": "optionA",
  "participantId2": "optionB"
}
```

#### 3. Flujo principal (Host desktop)

```mermaid
sequenceDiagram
    participant Host
    participant Backend
    participant Redis
    participant QR

    Host->>Backend: POST /session (quizId)
    Backend->>Redis: Crear sessionId
    Backend-->>Host: sessionId, QR Code
    Host->>QR: Mostrar código (https://app.com/join/{sessionId})
```

#### 4. Flujo de Participante (Dispositivo Móvil)

```mermaid
sequenceDiagram
    participant Móvil
    participant Backend
    participant Redis

    Móvil->>Backend: GET /join/{sessionId}
    Backend->>Redis: Agregar a waiting room
    Backend-->>Móvil: Mostrar "Esperando inicio..."
    Backend->>Host: Notificar nuevo participante
```

# Guía de Colaboración y Contribución

Este proyecto sigue un flujo de trabajo estricto para asegurar que **ningún cambio entre sin supervisión**.

## 🛡️ Reglas de Oro

1.  **Prohibido Commit Directo a `main`**: Nadie (excepto en casos de emergencia) debe subir código directamente a la rama principal.
2.  **Todo cambio mediante Pull Request (PR)**: Cualquier modificación debe venir de una rama separada.
3.  **Revisión Obligatoria**: Todos los Pull Requests requieren la aprobación del Administrador del repositorio para poder fusionarse.

## 🚀 Flujo de Trabajo para Colaboradores

Si quieres ayudar en el proyecto:

1.  **Crea una Rama**:
    ```bash
    git checkout -b nombre-de-la-tarea
    # Ejemplo: git checkout -b arreglar-login
    ```

2.  **Haz tus cambios**:
    Haz tus modificaciones y guarda tus commits.
    ```bash
    git add .
    git commit -m "Descripción de lo que hice"
    ```

3.  **Sube tu Rama**:
    ```bash
    git push origin nombre-de-la-tarea
    ```

4.  **Abre un Pull Request**:
    *   Ve al repositorio en GitHub.
    *   Verás un botón "Compare & pull request".
    *   Describe tus cambios y solicita revisión.

5.  **Espera Aprobación**:
    *   El dueño del repositorio revisará el código.
    *   Si hay cambios pedidos, hazlos en la misma rama y vuelve a subir (`git push`).
    *   Una vez aprobado, se fusionará a `main`.

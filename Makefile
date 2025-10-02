# Express.js Server Boilerplate Makefile
# Команды для Docker Compose и деплоя

# Переменные
DOCKER_IMAGE_NAME = expressjs-server-boilerplate
DOCKER_CONTAINER_NAME = expressjs-app
PORT = 3000

# Цвета для вывода
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help docker-compose-up docker-compose-down docker-compose-logs docker-build docker-run docker-stop docker-logs docker-clean

# Помощь - показать все доступные команды
help: ## Показать это сообщение помощи
	@echo "$(BLUE)Express.js Server Boilerplate - Доступные команды:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Docker Compose команды
docker-compose-up: ## Запустить через docker-compose
	@echo "$(YELLOW)Копируем .env.local.example в .env.local$(NC)"
	@if [ -f .env.local.example ]; then cp .env.local.example .env.local; fi
	@echo "$(GREEN)Запускаем через docker-compose...$(NC)"
	docker compose up --build -d

docker-compose-down: ## Остановить docker-compose
	@echo "$(YELLOW)Останавливаем docker-compose...$(NC)"
	docker compose down

docker-compose-logs: ## Показать логи docker-compose
	@echo "$(GREEN)Показываем логи docker-compose...$(NC)"
	docker compose logs -f

# Docker команды (альтернатива docker-compose)
docker-build: ## Собрать Docker образ
	@echo "$(YELLOW)Собираем Docker образ...$(NC)"
	docker build -t $(DOCKER_IMAGE_NAME) .

docker-run: docker-build ## Запустить контейнер
	@echo "$(GREEN)Запускаем Docker контейнер...$(NC)"
	docker run -d --restart unless-stopped --name $(DOCKER_CONTAINER_NAME) -e PORT=$(PORT) -p $(PORT):$(PORT) $(DOCKER_IMAGE_NAME)

docker-stop: ## Остановить Docker контейнер
	@echo "$(YELLOW)Останавливаем Docker контейнер...$(NC)"
	docker stop $(DOCKER_CONTAINER_NAME) || true
	docker rm $(DOCKER_CONTAINER_NAME) || true

docker-logs: ## Показать логи Docker контейнера
	docker logs -f $(DOCKER_CONTAINER_NAME)

docker-clean: docker-stop ## Удалить Docker образ и контейнер
	@echo "$(YELLOW)Удаляем Docker образ...$(NC)"
	docker rmi $(DOCKER_IMAGE_NAME) || true

# По умолчанию показываем помощь
.DEFAULT_GOAL := help
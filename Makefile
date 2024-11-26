.PHONY: dev
dev:
	bun x serve

.PHONY: deploy
deploy:
	bun x @cubing/deploy

.PHONY: lint
lint:
	bun x biome check

.PHONY: format
format:
	bun x biome check --write

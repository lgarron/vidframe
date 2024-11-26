.PHONY: dev
dev:
	bun x serve

.PHONY: deploy
deploy:
	bun x @cubing/deploy

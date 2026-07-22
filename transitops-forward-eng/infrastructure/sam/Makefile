# Makefile for Lambda Layer build
# Used by SAM build process

build-BackendDependencies:
	@echo "Building backend dependencies layer..."
	cd ../../backend && npm ci --omit=dev
	mkdir -p layer/nodejs
	cp -r ../../backend/node_modules layer/nodejs/
	cp ../../backend/package.json layer/nodejs/
	@echo "Layer built successfully"

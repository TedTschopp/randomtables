.PHONY: build
build:
	python3 scripts/site_analytics.py . --mode masked
	python3 scripts/site_analytics.py . --mode masked --check

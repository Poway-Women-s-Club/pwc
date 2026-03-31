HOST ?= localhost
PORT ?= 4600
REPO_NAME ?= pwc
LOG_FILE = /tmp/jekyll$(PORT).log

SHELL = /bin/bash -c
.SHELLFLAGS = -e

NOTEBOOK_FILES := $(shell find _notebooks -name '*.ipynb' 2>/dev/null)
DESTINATION_DIRECTORY = _posts
MARKDOWN_FILES := $(patsubst _notebooks/%.ipynb,$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md,$(NOTEBOOK_FILES))

default: serve-current
	@echo "Terminal logging starting, watching server for regeneration..."
	@(tail -f $(LOG_FILE) | awk '/Server address:/ { serverReady=1 } \
	serverReady && /^ *Regenerating:/ { regenerate=1 } \
	regenerate { \
		if (/^[[:blank:]]*$$/) { regenerate=0 } \
		else { print } \
	}') 2>/dev/null &
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo "Server started in $$COUNTER seconds"; \
			break; \
		fi; \
		if [ $$COUNTER -eq 120 ]; then \
			echo "Server timed out after $$COUNTER seconds."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@sed '$$d' $(LOG_FILE)

serve-current: stop convert
	@echo "Starting server..."
	@@nohup bundle install && bundle exec jekyll serve -H $(HOST) -P $(PORT) > $(LOG_FILE) 2>&1 & \
		PID=$$!; \
		echo "Server PID: $$PID"
	@@until [ -f $(LOG_FILE) ]; do sleep 1; done
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo "Server started in $$COUNTER seconds"; \
			grep "Server address:" $(LOG_FILE); \
			break; \
		fi; \
		if [ $$COUNTER -eq 120 ]; then \
			echo "Server timed out after $$COUNTER seconds."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		sleep 1; \
	done

build-current: clean
	@bundle install
	@bundle exec jekyll clean
	@bundle exec jekyll build

serve: serve-current
build: build-current

convert: $(MARKDOWN_FILES)
$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md: _notebooks/%.ipynb
	@mkdir -p $(@D)
	@python3 -c "from scripts.convert_notebooks import convert_notebooks; convert_notebooks()"

clean: stop
	@echo "Cleaning generated files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} + 2>/dev/null || true
	@echo "Removing _site directory..."
	@rm -rf _site

stop:
	@echo "Stopping server..."
	@@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping logging process..."
	@@ps aux | awk -v log_file=$(LOG_FILE) '$$0 ~ "tail -f " log_file { print $$2 }' | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE)

reload:
	@make stop
	@make

refresh:
	@make stop
	@make clean
	@make
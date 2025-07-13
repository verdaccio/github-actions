#!/bin/sh

set -e

# Configuration
local_registry="http://localhost:4873"
verdaccio_config_dir="$HOME/.config/verdaccio"
verdaccio_config_file="$verdaccio_config_dir/config.yaml"

# Logging functions
log_info() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_success() {
    echo "[SUCCESS] $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_debug() {
    if [ "$DEBUG" = "true" ]; then
        echo "[DEBUG] $(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

# Error handling
cleanup() {
    log_info "Cleaning up..."
    if [ -n "$verdaccio_pid" ]; then
        log_info "Stopping Verdaccio (PID: $verdaccio_pid)"
        kill $verdaccio_pid 2>/dev/null || true
    fi
    if [ -f "$tmp_registry_log" ]; then
        log_debug "Removing temporary log file: $tmp_registry_log"
        rm -f "$tmp_registry_log"
    fi
}

trap cleanup EXIT INT TERM

# Main script
log_info "Starting Verdaccio Publish Action v2"
log_info "Registry URL: $local_registry"

# Install npm-cli-login
log_info "Installing npm-cli-login..."
if ! npm install -g npm-cli-login; then
    log_error "Failed to install npm-cli-login"
    exit 1
fi
log_success "npm-cli-login installed successfully"

# Create temporary log file
tmp_registry_log=$(mktemp)
log_debug "Created temporary log file: $tmp_registry_log"

# Setup Verdaccio configuration
log_info "Setting up Verdaccio configuration..."
if ! mkdir -p "$verdaccio_config_dir"; then
    log_error "Failed to create Verdaccio config directory: $verdaccio_config_dir"
    exit 1
fi

if ! cp -v "/config.yaml" "$verdaccio_config_file"; then
    log_error "Failed to copy Verdaccio config file"
    exit 1
fi
log_success "Verdaccio configuration setup complete"

# Start Verdaccio registry with live output
log_info "Starting Verdaccio registry..."
echo "==================== VERDACCIO OUTPUT ===================="
verdaccio --config "$verdaccio_config_file" 2>&1 | tee "$tmp_registry_log" &
verdaccio_pid=$!
log_info "Verdaccio started with PID: $verdaccio_pid"

# Wait for Verdaccio to be ready
log_info "Waiting for Verdaccio to be ready..."
max_attempts=30
attempt=0

# Give Verdaccio a moment to start outputting logs
sleep 2

while [ $attempt -lt $max_attempts ]; do
    if grep -q "http address" "$tmp_registry_log" 2>/dev/null; then
        echo "==================== END VERDACCIO OUTPUT ===================="
        log_success "Verdaccio is ready and listening"
        break
    fi
    
    # Check if Verdaccio process is still running
    if ! kill -0 $verdaccio_pid 2>/dev/null; then
        log_error "Verdaccio process died unexpectedly"
        exit 1
    fi
    
    attempt=$((attempt + 1))
    log_debug "Attempt $attempt/$max_attempts - waiting for Verdaccio..."
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    log_error "Timeout waiting for Verdaccio to start"
    exit 1
fi

# Authenticate with registry using npm-cli-login
log_info "Authenticating with registry using npm-cli-login..."
if ! npm-cli-login -u test -p test -e test@test.com -r "$local_registry"; then
    log_error "Failed to authenticate with registry using npm-cli-login"
    # Fallback to npm-auth-to-token if available
    log_info "Trying fallback authentication with npm-auth-to-token..."
    if ! npm-auth-to-token -u test -p test -e test@test.com -r "$local_registry"; then
        log_error "Failed to authenticate with registry"
        exit 1
    fi
fi
log_success "Authentication successful"

# Publish package
log_info "Publishing package to registry..."
log_info "Registry: $local_registry"
if [ -n "$1" ]; then
    log_info "Additional arguments: $1"
    if ! npm publish --registry "$local_registry" "$1"; then
        log_error "Failed to publish package with arguments: $1"
        exit 1
    fi
else
    if ! npm publish --registry "$local_registry"; then
        log_error "Failed to publish package"
        exit 1
    fi
fi

log_success "Package published successfully to $local_registry"
log_info "Verdaccio Publish Action v2 completed successfully"
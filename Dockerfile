FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies in a single layer
RUN apt-get update && apt-get install -y \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Run with gunicorn
CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]

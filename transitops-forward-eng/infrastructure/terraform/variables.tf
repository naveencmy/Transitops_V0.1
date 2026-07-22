variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "transitops"
}

variable "database_url" {
  description = "Neon PostgreSQL connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key (min 32 chars)"
  type        = string
  sensitive   = true
}

variable "cloudfront_domain" {
  description = "CloudFront domain for CORS"
  type        = string
  default     = ""
}

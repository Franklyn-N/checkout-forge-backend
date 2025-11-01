import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateValidatorService {
  validateHtmlTemplate(html: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!html || html.trim().length === 0) {
      errors.push('Template HTML cannot be empty');
      return { valid: false, errors };
    }

    if (html.length > 5 * 1024 * 1024) {
      errors.push('Template size exceeds 5MB limit');
    }

    const dangerousPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /on\w+\s*=/gi,
      /javascript:/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(html)) {
        errors.push(`Dangerous code detected: ${pattern.source}`);
      }
    }

    const requiredPlaceholders = ['{{product_name}}', '{{price}}'];
    for (const placeholder of requiredPlaceholders) {
      if (!html.includes(placeholder)) {
        errors.push(`Missing required placeholder: ${placeholder}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  validateMetadata(metadata: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata) {
      errors.push('Metadata is required');
      return { valid: false, errors };
    }

    if (typeof metadata !== 'object') {
      errors.push('Metadata must be an object');
    }

    return { valid: errors.length === 0, errors };
  }

  extractPlaceholders(html: string): string[] {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders = new Set<string>();
    let match;

    while ((match = placeholderRegex.exec(html)) !== null) {
      placeholders.add(match[1].trim());
    }

    return Array.from(placeholders);
  }
}

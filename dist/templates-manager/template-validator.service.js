"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateValidatorService = void 0;
const common_1 = require("@nestjs/common");
let TemplateValidatorService = class TemplateValidatorService {
    validateHtmlTemplate(html) {
        const errors = [];
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
    validateMetadata(metadata) {
        const errors = [];
        if (!metadata) {
            errors.push('Metadata is required');
            return { valid: false, errors };
        }
        if (typeof metadata !== 'object') {
            errors.push('Metadata must be an object');
        }
        return { valid: errors.length === 0, errors };
    }
    extractPlaceholders(html) {
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        const placeholders = new Set();
        let match;
        while ((match = placeholderRegex.exec(html)) !== null) {
            placeholders.add(match[1].trim());
        }
        return Array.from(placeholders);
    }
};
exports.TemplateValidatorService = TemplateValidatorService;
exports.TemplateValidatorService = TemplateValidatorService = __decorate([
    (0, common_1.Injectable)()
], TemplateValidatorService);
//# sourceMappingURL=template-validator.service.js.map
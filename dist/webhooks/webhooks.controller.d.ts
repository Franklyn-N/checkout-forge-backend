import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class WebhooksController {
    private webhooksService;
    private stripeService;
    constructor(webhooksService: WebhooksService, stripeService: StripeService);
    handleStripeWebhook(signature: string, request: RawBodyRequest<Request>): Promise<{
        received: boolean;
        alreadyProcessed: boolean;
        processed?: undefined;
    } | {
        received: boolean;
        processed: boolean;
        alreadyProcessed?: undefined;
    }>;
}

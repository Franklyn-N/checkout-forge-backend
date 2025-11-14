import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    listSubscriptions(user: any, customerId?: string): Promise<any>;
    getSubscription(id: string, user: any): Promise<any>;
    cancelSubscription(id: string, user: any): Promise<any>;
}

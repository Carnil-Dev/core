import { z } from 'zod';

declare const CustomerSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    deleted: z.ZodOptional<z.ZodBoolean>;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    deleted?: boolean | undefined;
}, {
    id: string;
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    deleted?: boolean | undefined;
}>;
declare const PaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    type: z.ZodEnum<["card", "bank_account", "upi", "wallet", "netbanking", "emi"]>;
    brand: z.ZodOptional<z.ZodString>;
    last4: z.ZodOptional<z.ZodString>;
    expiryMonth: z.ZodOptional<z.ZodNumber>;
    expiryYear: z.ZodOptional<z.ZodNumber>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "card" | "bank_account" | "upi" | "wallet" | "netbanking" | "emi";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    isDefault: boolean;
    metadata?: Record<string, string> | undefined;
    brand?: string | undefined;
    last4?: string | undefined;
    expiryMonth?: number | undefined;
    expiryYear?: number | undefined;
}, {
    id: string;
    type: "card" | "bank_account" | "upi" | "wallet" | "netbanking" | "emi";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    metadata?: Record<string, string> | undefined;
    brand?: string | undefined;
    last4?: string | undefined;
    expiryMonth?: number | undefined;
    expiryYear?: number | undefined;
    isDefault?: boolean | undefined;
}>;
declare const PaymentIntentSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    status: z.ZodEnum<["requires_payment_method", "requires_confirmation", "requires_action", "processing", "requires_capture", "canceled", "succeeded", "failed"]>;
    clientSecret: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    receiptEmail: z.ZodOptional<z.ZodString>;
    created: z.ZodDate;
    updated: z.ZodDate;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "processing" | "requires_capture" | "canceled" | "succeeded" | "failed";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    amount: number;
    currency: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    clientSecret?: string | undefined;
    paymentMethodId?: string | undefined;
    receiptEmail?: string | undefined;
}, {
    id: string;
    status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "processing" | "requires_capture" | "canceled" | "succeeded" | "failed";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    amount: number;
    currency: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    clientSecret?: string | undefined;
    paymentMethodId?: string | undefined;
    receiptEmail?: string | undefined;
}>;
declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    status: z.ZodEnum<["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"]>;
    currentPeriodStart: z.ZodDate;
    currentPeriodEnd: z.ZodDate;
    cancelAtPeriodEnd: z.ZodDefault<z.ZodBoolean>;
    canceledAt: z.ZodOptional<z.ZodDate>;
    trialStart: z.ZodOptional<z.ZodDate>;
    trialEnd: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "canceled" | "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "unpaid" | "paused";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    metadata?: Record<string, string> | undefined;
    canceledAt?: Date | undefined;
    trialStart?: Date | undefined;
    trialEnd?: Date | undefined;
}, {
    id: string;
    status: "canceled" | "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "unpaid" | "paused";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    metadata?: Record<string, string> | undefined;
    cancelAtPeriodEnd?: boolean | undefined;
    canceledAt?: Date | undefined;
    trialStart?: Date | undefined;
    trialEnd?: Date | undefined;
}>;
declare const InvoiceSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    subscriptionId: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "open", "paid", "void", "uncollectible"]>;
    amount: z.ZodNumber;
    currency: z.ZodString;
    amountPaid: z.ZodDefault<z.ZodNumber>;
    amountDue: z.ZodNumber;
    subtotal: z.ZodNumber;
    tax: z.ZodDefault<z.ZodNumber>;
    total: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    hostedInvoiceUrl: z.ZodOptional<z.ZodString>;
    invoicePdf: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    dueDate: z.ZodOptional<z.ZodDate>;
    paidAt: z.ZodOptional<z.ZodDate>;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "void" | "draft" | "open" | "paid" | "uncollectible";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    amount: number;
    currency: string;
    amountPaid: number;
    amountDue: number;
    subtotal: number;
    tax: number;
    total: number;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    subscriptionId?: string | undefined;
    hostedInvoiceUrl?: string | undefined;
    invoicePdf?: string | undefined;
    dueDate?: Date | undefined;
    paidAt?: Date | undefined;
}, {
    id: string;
    status: "void" | "draft" | "open" | "paid" | "uncollectible";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    customerId: string;
    amount: number;
    currency: string;
    amountDue: number;
    subtotal: number;
    total: number;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    subscriptionId?: string | undefined;
    amountPaid?: number | undefined;
    tax?: number | undefined;
    hostedInvoiceUrl?: string | undefined;
    invoicePdf?: string | undefined;
    dueDate?: Date | undefined;
    paidAt?: Date | undefined;
}>;
declare const RefundSchema: z.ZodObject<{
    id: z.ZodString;
    paymentId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    status: z.ZodEnum<["pending", "succeeded", "failed", "canceled"]>;
    reason: z.ZodOptional<z.ZodEnum<["duplicate", "fraudulent", "requested_by_customer"]>>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "canceled" | "succeeded" | "failed" | "pending";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    amount: number;
    currency: string;
    paymentId: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
}, {
    id: string;
    status: "canceled" | "succeeded" | "failed" | "pending";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    amount: number;
    currency: string;
    paymentId: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
}>;
declare const DisputeSchema: z.ZodObject<{
    id: z.ZodString;
    paymentId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    status: z.ZodEnum<["warning_needs_response", "warning_under_review", "warning_closed", "needs_response", "under_review", "charge_refunded", "won", "lost"]>;
    reason: z.ZodEnum<["credit_not_processed", "duplicate", "fraudulent", "general", "incorrect_account_details", "insufficient_funds", "product_not_received", "product_unacceptable", "subscription_canceled", "unrecognized"]>;
    evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    created: z.ZodDate;
    updated: z.ZodDate;
    provider: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "warning_needs_response" | "warning_under_review" | "warning_closed" | "needs_response" | "under_review" | "charge_refunded" | "won" | "lost";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    amount: number;
    currency: string;
    paymentId: string;
    reason: "duplicate" | "fraudulent" | "credit_not_processed" | "general" | "incorrect_account_details" | "insufficient_funds" | "product_not_received" | "product_unacceptable" | "subscription_canceled" | "unrecognized";
    metadata?: Record<string, string> | undefined;
    evidence?: Record<string, any> | undefined;
}, {
    id: string;
    status: "warning_needs_response" | "warning_under_review" | "warning_closed" | "needs_response" | "under_review" | "charge_refunded" | "won" | "lost";
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
    amount: number;
    currency: string;
    paymentId: string;
    reason: "duplicate" | "fraudulent" | "credit_not_processed" | "general" | "incorrect_account_details" | "insufficient_funds" | "product_not_received" | "product_unacceptable" | "subscription_canceled" | "unrecognized";
    metadata?: Record<string, string> | undefined;
    evidence?: Record<string, any> | undefined;
}>;
declare const CreateCustomerRequestSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
}>;
declare const UpdateCustomerRequestSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
}>;
declare const CreatePaymentIntentRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    receiptEmail: z.ZodOptional<z.ZodString>;
    captureMethod: z.ZodDefault<z.ZodEnum<["automatic", "manual"]>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    amount: number;
    currency: string;
    captureMethod: "automatic" | "manual";
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    paymentMethodId?: string | undefined;
    receiptEmail?: string | undefined;
}, {
    customerId: string;
    amount: number;
    currency: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    paymentMethodId?: string | undefined;
    receiptEmail?: string | undefined;
    captureMethod?: "automatic" | "manual" | undefined;
}>;
declare const CreateSubscriptionRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    priceId: z.ZodString;
    trialPeriodDays: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    priceId: string;
    metadata?: Record<string, string> | undefined;
    paymentMethodId?: string | undefined;
    trialPeriodDays?: number | undefined;
}, {
    customerId: string;
    priceId: string;
    metadata?: Record<string, string> | undefined;
    paymentMethodId?: string | undefined;
    trialPeriodDays?: number | undefined;
}>;
declare const CreateInvoiceRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    subscriptionId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    currency: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    amount: number;
    currency: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    subscriptionId?: string | undefined;
    dueDate?: Date | undefined;
}, {
    customerId: string;
    amount: number;
    currency: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    subscriptionId?: string | undefined;
    dueDate?: Date | undefined;
}>;
declare const CreateRefundRequestSchema: z.ZodObject<{
    paymentId: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodEnum<["duplicate", "fraudulent", "requested_by_customer"]>>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    paymentId: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    amount?: number | undefined;
    reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
}, {
    paymentId: string;
    description?: string | undefined;
    metadata?: Record<string, string> | undefined;
    amount?: number | undefined;
    reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
}>;
declare const ListRequestSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    startingAfter: z.ZodOptional<z.ZodString>;
    endingBefore: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodObject<{
        gte: z.ZodOptional<z.ZodDate>;
        lte: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}, {
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    limit?: number | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}>;
declare const CustomerListRequestSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    startingAfter: z.ZodOptional<z.ZodString>;
    endingBefore: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodObject<{
        gte: z.ZodOptional<z.ZodDate>;
        lte: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }>>;
} & {
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    email?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}, {
    email?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    limit?: number | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}>;
declare const PaymentIntentListRequestSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    startingAfter: z.ZodOptional<z.ZodString>;
    endingBefore: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodObject<{
        gte: z.ZodOptional<z.ZodDate>;
        lte: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }>>;
} & {
    customerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}, {
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    limit?: number | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}>;
declare const SubscriptionListRequestSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    startingAfter: z.ZodOptional<z.ZodString>;
    endingBefore: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodObject<{
        gte: z.ZodOptional<z.ZodDate>;
        lte: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }>>;
} & {
    customerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}, {
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    limit?: number | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}>;
declare const InvoiceListRequestSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    startingAfter: z.ZodOptional<z.ZodString>;
    endingBefore: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodObject<{
        gte: z.ZodOptional<z.ZodDate>;
        lte: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }, {
        gte?: Date | undefined;
        lte?: Date | undefined;
    }>>;
} & {
    customerId: z.ZodOptional<z.ZodString>;
    subscriptionId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    subscriptionId?: string | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}, {
    status?: string | undefined;
    created?: {
        gte?: Date | undefined;
        lte?: Date | undefined;
    } | undefined;
    customerId?: string | undefined;
    subscriptionId?: string | undefined;
    limit?: number | undefined;
    startingAfter?: string | undefined;
    endingBefore?: string | undefined;
}>;
declare const WebhookEventSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    created: z.ZodDate;
    provider: z.ZodString;
    livemode: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    created: Date;
    provider: string;
    data: Record<string, any>;
    livemode: boolean;
}, {
    id: string;
    type: string;
    created: Date;
    provider: string;
    data: Record<string, any>;
    livemode: boolean;
}>;
declare const UsageMetricsSchema: z.ZodObject<{
    customerId: z.ZodString;
    featureId: z.ZodString;
    usage: z.ZodNumber;
    limit: z.ZodOptional<z.ZodNumber>;
    period: z.ZodEnum<["day", "week", "month", "year"]>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    featureId: string;
    usage: number;
    period: "day" | "week" | "month" | "year";
    startDate: Date;
    endDate: Date;
    metadata?: Record<string, string> | undefined;
    limit?: number | undefined;
}, {
    customerId: string;
    featureId: string;
    usage: number;
    period: "day" | "week" | "month" | "year";
    startDate: Date;
    endDate: Date;
    metadata?: Record<string, string> | undefined;
    limit?: number | undefined;
}>;
declare const AIUsageMetricsSchema: z.ZodObject<{
    customerId: z.ZodString;
    modelId: z.ZodString;
    tokens: z.ZodNumber;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    cost: z.ZodNumber;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    modelId: string;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    timestamp: Date;
    metadata?: Record<string, string> | undefined;
}, {
    customerId: string;
    modelId: string;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    timestamp: Date;
    metadata?: Record<string, string> | undefined;
}>;
type Customer = z.infer<typeof CustomerSchema>;
type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
type PaymentIntent = z.infer<typeof PaymentIntentSchema>;
type Subscription = z.infer<typeof SubscriptionSchema>;
type Invoice = z.infer<typeof InvoiceSchema>;
type Refund = z.infer<typeof RefundSchema>;
type Dispute = z.infer<typeof DisputeSchema>;
type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>;
type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>;
type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequestSchema>;
type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequestSchema>;
type CreateInvoiceRequest = z.infer<typeof CreateInvoiceRequestSchema>;
type CreateRefundRequest = z.infer<typeof CreateRefundRequestSchema>;
type CreateCustomerParams = CreateCustomerRequest;
type UpdateCustomerParams = UpdateCustomerRequest;
type RetrieveCustomerParams = {
    id: string;
};
type ListCustomersParams = CustomerListRequest;
type CreatePaymentMethodParams = {
    customerId: string;
    type: 'card' | 'bank_account' | 'upi' | 'wallet' | 'netbanking' | 'emi';
    token?: string;
    metadata?: Record<string, any>;
};
type UpdatePaymentMethodParams = {
    metadata?: Record<string, any>;
};
type RetrievePaymentMethodParams = {
    id: string;
};
type ListPaymentMethodsParams = {
    customerId: string;
};
type Product = {
    id: string;
    name: string;
    description?: string;
    metadata?: Record<string, any>;
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
};
type CreateProductParams = {
    name: string;
    description?: string;
    metadata?: Record<string, any>;
};
type UpdateProductParams = {
    name?: string;
    description?: string;
    metadata?: Record<string, any>;
};
type RetrieveProductParams = {
    id: string;
};
type ListProductsParams = {
    limit?: number;
    startingAfter?: string;
};
type Price = {
    id: string;
    productId: string;
    amount: number;
    currency: string;
    interval?: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
    metadata?: Record<string, any>;
    created: Date;
    updated: Date;
    provider: string;
    providerId: string;
};
type CreatePriceParams = {
    productId: string;
    amount: number;
    currency: string;
    interval?: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
    metadata?: Record<string, any>;
};
type UpdatePriceParams = {
    metadata?: Record<string, any>;
};
type RetrievePriceParams = {
    id: string;
};
type ListPricesParams = {
    productId?: string;
    limit?: number;
    startingAfter?: string;
};
type CreateSubscriptionParams = CreateSubscriptionRequest;
type UpdateSubscriptionParams = Partial<CreateSubscriptionRequest>;
type RetrieveSubscriptionParams = {
    id: string;
};
type ListSubscriptionsParams = SubscriptionListRequest;
type CreateInvoiceParams = CreateInvoiceRequest;
type UpdateInvoiceParams = Partial<CreateInvoiceRequest>;
type RetrieveInvoiceParams = {
    id: string;
};
type ListInvoicesParams = InvoiceListRequest;
type CreateRefundParams = CreateRefundRequest;
type RetrieveRefundParams = {
    id: string;
};
type ListRefundsParams = {
    paymentId?: string;
    limit?: number;
    startingAfter?: string;
};
type RetrieveDisputeParams = {
    id: string;
};
type ListDisputesParams = {
    limit?: number;
    startingAfter?: string;
};
type CreatePaymentIntentParams = CreatePaymentIntentRequest;
type UpdatePaymentIntentParams = Partial<CreatePaymentIntentRequest>;
type RetrievePaymentIntentParams = {
    id: string;
};
type ListPaymentIntentsParams = PaymentIntentListRequest;
type ListRequest = z.infer<typeof ListRequestSchema>;
type CustomerListRequest = z.infer<typeof CustomerListRequestSchema>;
type PaymentIntentListRequest = z.infer<typeof PaymentIntentListRequestSchema>;
type SubscriptionListRequest = z.infer<typeof SubscriptionListRequestSchema>;
type InvoiceListRequest = z.infer<typeof InvoiceListRequestSchema>;
type WebhookEvent = z.infer<typeof WebhookEventSchema>;
type UsageMetrics = z.infer<typeof UsageMetricsSchema>;
type AIUsageMetrics = z.infer<typeof AIUsageMetricsSchema>;
interface ProviderConfig {
    provider: string;
    apiKey: string;
    webhookSecret?: string;
    baseUrl?: string;
    timeout?: number;
    retries?: number;
}
interface CarnilConfig {
    provider: ProviderConfig;
    debug?: boolean;
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    userAgent?: string;
}
interface ListResponse<T> {
    data: T[];
    hasMore: boolean;
    totalCount?: number;
    nextCursor?: string;
    prevCursor?: string;
}
interface CarnilResponse<T> {
    data: T;
    success: boolean;
    error?: string;
    metadata?: Record<string, any>;
}

interface BaseProvider {
    name: string;
    init(config: Record<string, any>): Promise<void>;
}
interface CustomerProvider {
    createCustomer(params: CreateCustomerParams): Promise<Customer>;
    retrieveCustomer(params: RetrieveCustomerParams): Promise<Customer>;
    updateCustomer(id: string, params: UpdateCustomerParams): Promise<Customer>;
    deleteCustomer(id: string): Promise<void>;
    listCustomers(params?: ListCustomersParams): Promise<Customer[]>;
}
interface PaymentMethodProvider {
    createPaymentMethod(params: CreatePaymentMethodParams): Promise<PaymentMethod>;
    retrievePaymentMethod(params: RetrievePaymentMethodParams): Promise<PaymentMethod>;
    updatePaymentMethod(id: string, params: UpdatePaymentMethodParams): Promise<PaymentMethod>;
    deletePaymentMethod(id: string): Promise<void>;
    listPaymentMethods(params?: ListPaymentMethodsParams): Promise<PaymentMethod[]>;
}
interface ProductProvider {
    createProduct(params: CreateProductParams): Promise<Product>;
    retrieveProduct(params: RetrieveProductParams): Promise<Product>;
    updateProduct(id: string, params: UpdateProductParams): Promise<Product>;
    listProducts(params?: ListProductsParams): Promise<Product[]>;
}
interface PriceProvider {
    createPrice(params: CreatePriceParams): Promise<Price>;
    retrievePrice(params: RetrievePriceParams): Promise<Price>;
    updatePrice(id: string, params: UpdatePriceParams): Promise<Price>;
    listPrices(params?: ListPricesParams): Promise<Price[]>;
}
interface SubscriptionProvider {
    createSubscription(params: CreateSubscriptionParams): Promise<Subscription>;
    retrieveSubscription(params: RetrieveSubscriptionParams): Promise<Subscription>;
    updateSubscription(id: string, params: UpdateSubscriptionParams): Promise<Subscription>;
    cancelSubscription(id: string): Promise<Subscription>;
    listSubscriptions(params?: ListSubscriptionsParams): Promise<Subscription[]>;
}
interface InvoiceProvider {
    retrieveInvoice(params: RetrieveInvoiceParams): Promise<Invoice>;
    listInvoices(params?: ListInvoicesParams): Promise<Invoice[]>;
}
interface RefundProvider {
    createRefund(params: CreateRefundParams): Promise<Refund>;
    retrieveRefund(params: RetrieveRefundParams): Promise<Refund>;
    listRefunds(params?: ListRefundsParams): Promise<Refund[]>;
}
interface DisputeProvider {
    retrieveDispute(params: RetrieveDisputeParams): Promise<Dispute>;
    listDisputes(params?: ListDisputesParams): Promise<Dispute[]>;
}
interface PaymentIntentProvider {
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;
    retrievePaymentIntent(params: RetrievePaymentIntentParams): Promise<PaymentIntent>;
    updatePaymentIntent(id: string, params: UpdatePaymentIntentParams): Promise<PaymentIntent>;
    listPaymentIntents(params?: ListPaymentIntentsParams): Promise<PaymentIntent[]>;
}
interface PaymentProvider extends PaymentIntentProvider {
}
interface AnalyticsProvider {
    trackEvent(event: string, properties?: Record<string, any>): Promise<void>;
    trackPageView(page: string, properties?: Record<string, any>): Promise<void>;
    trackUser(userId: string, properties?: Record<string, any>): Promise<void>;
    getMetrics(timeRange: {
        start: Date;
        end: Date;
    }): Promise<any>;
}
interface ProviderRegistry {
    register(name: string, provider: any): void;
    get(name: string): any;
    list(): string[];
    unregister(name: string): boolean;
    create(name: string, config: any): CarnilProvider;
}
interface HealthCheckProvider {
    healthCheck(): Promise<boolean>;
}
interface PaymentMethodOperationsProvider {
    attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod>;
    detachPaymentMethod(paymentMethodId: string): Promise<void>;
    setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod>;
}
interface PaymentIntentOperationsProvider {
    getPaymentIntent(id: string): Promise<PaymentIntent>;
    cancelPaymentIntent(id: string): Promise<PaymentIntent>;
    confirmPaymentIntent(id: string, paymentMethodId?: string): Promise<PaymentIntent>;
    capturePaymentIntent(id: string, amount?: number): Promise<PaymentIntent>;
}
interface SubscriptionOperationsProvider {
    getSubscription(id: string): Promise<Subscription>;
}
interface InvoiceOperationsProvider {
    createInvoice(params: CreateInvoiceParams): Promise<Invoice>;
    getInvoice(id: string): Promise<Invoice>;
    updateInvoice(id: string, params: UpdateInvoiceParams): Promise<Invoice>;
    finalizeInvoice(id: string): Promise<Invoice>;
    payInvoice(id: string, paymentMethodId?: string): Promise<Invoice>;
}
interface RefundOperationsProvider {
    getRefund(id: string): Promise<Refund>;
}
interface WebhookProvider {
    verifyWebhook(payload: string, signature: string, secret: string): Promise<boolean>;
    parseWebhook(payload: string, signature: string, secret: string): Promise<WebhookEvent>;
}
interface AnalyticsOperationsProvider {
    trackUsage(metrics: UsageMetrics): Promise<void>;
    trackAIUsage(metrics: AIUsageMetrics): Promise<void>;
    getUsageMetrics(customerId: string, featureId: string, period: string): Promise<UsageMetrics[]>;
    getAIUsageMetrics(customerId: string, modelId?: string, period?: string): Promise<AIUsageMetrics[]>;
}
interface CarnilProvider extends BaseProvider, CustomerProvider, PaymentMethodProvider, ProductProvider, PriceProvider, SubscriptionProvider, InvoiceProvider, RefundProvider, DisputeProvider, PaymentIntentProvider, HealthCheckProvider, PaymentMethodOperationsProvider, PaymentIntentOperationsProvider, SubscriptionOperationsProvider, InvoiceOperationsProvider, RefundOperationsProvider, WebhookProvider, AnalyticsOperationsProvider {
}

declare class Carnil {
    private provider;
    private config;
    private static registry;
    constructor(config: CarnilConfig);
    static registerProvider(name: string, factory: any): void;
    static getRegisteredProviders(): string[];
    static createProvider(name: string, config: any): CarnilProvider;
    getProvider(): CarnilProvider;
    getConfig(): CarnilConfig;
    healthCheck(): Promise<boolean>;
    createCustomer(request: CreateCustomerRequest): Promise<CarnilResponse<Customer>>;
    getCustomer(id: string): Promise<CarnilResponse<Customer>>;
    updateCustomer(id: string, request: UpdateCustomerRequest): Promise<CarnilResponse<Customer>>;
    deleteCustomer(id: string): Promise<CarnilResponse<void>>;
    listCustomers(request?: CustomerListRequest): Promise<CarnilResponse<ListResponse<Customer>>>;
    listPaymentMethods(customerId: string): Promise<CarnilResponse<PaymentMethod[]>>;
    attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<CarnilResponse<PaymentMethod>>;
    detachPaymentMethod(paymentMethodId: string): Promise<CarnilResponse<void>>;
    setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<CarnilResponse<PaymentMethod>>;
    createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CarnilResponse<PaymentIntent>>;
    getPaymentIntent(id: string): Promise<CarnilResponse<PaymentIntent>>;
    updatePaymentIntent(id: string, updates: Partial<CreatePaymentIntentRequest>): Promise<CarnilResponse<PaymentIntent>>;
    cancelPaymentIntent(id: string): Promise<CarnilResponse<PaymentIntent>>;
    confirmPaymentIntent(id: string, paymentMethodId?: string): Promise<CarnilResponse<PaymentIntent>>;
    capturePaymentIntent(id: string, amount?: number): Promise<CarnilResponse<PaymentIntent>>;
    listPaymentIntents(request?: PaymentIntentListRequest): Promise<CarnilResponse<ListResponse<PaymentIntent>>>;
    createSubscription(request: CreateSubscriptionRequest): Promise<CarnilResponse<Subscription>>;
    getSubscription(id: string): Promise<CarnilResponse<Subscription>>;
    updateSubscription(id: string, updates: Partial<CreateSubscriptionRequest>): Promise<CarnilResponse<Subscription>>;
    cancelSubscription(id: string): Promise<CarnilResponse<Subscription>>;
    listSubscriptions(request?: SubscriptionListRequest): Promise<CarnilResponse<ListResponse<Subscription>>>;
    createInvoice(request: CreateInvoiceRequest): Promise<CarnilResponse<Invoice>>;
    getInvoice(id: string): Promise<CarnilResponse<Invoice>>;
    updateInvoice(id: string, updates: Partial<CreateInvoiceRequest>): Promise<CarnilResponse<Invoice>>;
    finalizeInvoice(id: string): Promise<CarnilResponse<Invoice>>;
    payInvoice(id: string, paymentMethodId?: string): Promise<CarnilResponse<Invoice>>;
    listInvoices(request?: InvoiceListRequest): Promise<CarnilResponse<ListResponse<Invoice>>>;
    createRefund(request: CreateRefundRequest): Promise<CarnilResponse<Refund>>;
    getRefund(id: string): Promise<CarnilResponse<Refund>>;
    listRefunds(paymentId?: string): Promise<CarnilResponse<Refund[]>>;
    verifyWebhook(payload: string, signature: string, secret: string): Promise<boolean>;
    parseWebhook(payload: string, signature: string, secret: string): Promise<WebhookEvent>;
    trackUsage(metrics: UsageMetrics): Promise<CarnilResponse<void>>;
    trackAIUsage(metrics: AIUsageMetrics): Promise<CarnilResponse<void>>;
    getUsageMetrics(customerId: string, featureId: string, period: string): Promise<CarnilResponse<UsageMetrics[]>>;
    getAIUsageMetrics(customerId: string, modelId?: string, period?: string): Promise<CarnilResponse<AIUsageMetrics[]>>;
}

/**
 * Carnil SDK Error Classes
 * Provides structured error handling across all providers
 */
declare class CarnilError extends Error {
    readonly code: string;
    readonly type: string;
    readonly statusCode?: number;
    readonly provider?: string;
    readonly providerError?: any;
    constructor(message: string, code?: string, type?: string, statusCode?: number, provider?: string, providerError?: any);
}
declare class CarnilValidationError extends CarnilError {
    constructor(message: string, field?: string);
}
declare class CarnilAuthenticationError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilPermissionError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilNotFoundError extends CarnilError {
    constructor(resource: string, id?: string, provider?: string);
}
declare class CarnilRateLimitError extends CarnilError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number, provider?: string);
}
declare class CarnilServerError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilNetworkError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilTimeoutError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilWebhookError extends CarnilError {
    constructor(message?: string, provider?: string);
}
declare class CarnilProviderError extends CarnilError {
    constructor(message: string, provider: string, providerError?: any, statusCode?: number);
}
declare function createProviderError(provider: string, error: any, message?: string): CarnilProviderError;
declare function createValidationError(message: string, field?: string): CarnilValidationError;
declare function createNotFoundError(resource: string, id?: string, provider?: string): CarnilNotFoundError;
declare function createRateLimitError(retryAfter?: number, provider?: string): CarnilRateLimitError;
declare function isCarnilError(error: any): error is CarnilError;
declare function isCarnilValidationError(error: any): error is CarnilValidationError;
declare function isCarnilAuthenticationError(error: any): error is CarnilAuthenticationError;
declare function isCarnilPermissionError(error: any): error is CarnilPermissionError;
declare function isCarnilNotFoundError(error: any): error is CarnilNotFoundError;
declare function isCarnilRateLimitError(error: any): error is CarnilRateLimitError;
declare function isCarnilServerError(error: any): error is CarnilServerError;
declare function isCarnilNetworkError(error: any): error is CarnilNetworkError;
declare function isCarnilTimeoutError(error: any): error is CarnilTimeoutError;
declare function isCarnilWebhookError(error: any): error is CarnilWebhookError;
declare function isCarnilProviderError(error: any): error is CarnilProviderError;
declare function handleError(error: any, provider?: string): CarnilError;

export { type AIUsageMetrics, AIUsageMetricsSchema, type AnalyticsOperationsProvider, type AnalyticsProvider, type BaseProvider, Carnil, CarnilAuthenticationError, type CarnilConfig, CarnilError, CarnilNetworkError, CarnilNotFoundError, CarnilPermissionError, type CarnilProvider, CarnilProviderError, CarnilRateLimitError, type CarnilResponse, CarnilServerError, CarnilTimeoutError, CarnilValidationError, CarnilWebhookError, type CreateCustomerParams, type CreateCustomerRequest, CreateCustomerRequestSchema, type CreateInvoiceParams, type CreateInvoiceRequest, CreateInvoiceRequestSchema, type CreatePaymentIntentParams, type CreatePaymentIntentRequest, CreatePaymentIntentRequestSchema, type CreatePaymentMethodParams, type CreatePriceParams, type CreateProductParams, type CreateRefundParams, type CreateRefundRequest, CreateRefundRequestSchema, type CreateSubscriptionParams, type CreateSubscriptionRequest, CreateSubscriptionRequestSchema, type Customer, type CustomerListRequest, CustomerListRequestSchema, type CustomerProvider, CustomerSchema, type Dispute, type DisputeProvider, DisputeSchema, type HealthCheckProvider, type Invoice, type InvoiceListRequest, InvoiceListRequestSchema, type InvoiceOperationsProvider, type InvoiceProvider, InvoiceSchema, type ListCustomersParams, type ListDisputesParams, type ListInvoicesParams, type ListPaymentIntentsParams, type ListPaymentMethodsParams, type ListPricesParams, type ListProductsParams, type ListRefundsParams, type ListRequest, ListRequestSchema, type ListResponse, type ListSubscriptionsParams, type PaymentIntent, type PaymentIntentListRequest, PaymentIntentListRequestSchema, type PaymentIntentOperationsProvider, type PaymentIntentProvider, PaymentIntentSchema, type PaymentMethod, type PaymentMethodOperationsProvider, type PaymentMethodProvider, PaymentMethodSchema, type PaymentProvider, type Price, type PriceProvider, type Product, type ProductProvider, type ProviderConfig, type ProviderRegistry, type Refund, type RefundOperationsProvider, type RefundProvider, RefundSchema, type RetrieveCustomerParams, type RetrieveDisputeParams, type RetrieveInvoiceParams, type RetrievePaymentIntentParams, type RetrievePaymentMethodParams, type RetrievePriceParams, type RetrieveProductParams, type RetrieveRefundParams, type RetrieveSubscriptionParams, type Subscription, type SubscriptionListRequest, SubscriptionListRequestSchema, type SubscriptionOperationsProvider, type SubscriptionProvider, SubscriptionSchema, type UpdateCustomerParams, type UpdateCustomerRequest, UpdateCustomerRequestSchema, type UpdateInvoiceParams, type UpdatePaymentIntentParams, type UpdatePaymentMethodParams, type UpdatePriceParams, type UpdateProductParams, type UpdateSubscriptionParams, type UsageMetrics, UsageMetricsSchema, type WebhookEvent, WebhookEventSchema, type WebhookProvider, createNotFoundError, createProviderError, createRateLimitError, createValidationError, Carnil as default, handleError, isCarnilAuthenticationError, isCarnilError, isCarnilNetworkError, isCarnilNotFoundError, isCarnilPermissionError, isCarnilProviderError, isCarnilRateLimitError, isCarnilServerError, isCarnilTimeoutError, isCarnilValidationError, isCarnilWebhookError };

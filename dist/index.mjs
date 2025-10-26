import { z } from 'zod';

// src/errors.ts
var CarnilError = class _CarnilError extends Error {
  constructor(message, code = "UNKNOWN_ERROR", type = "CARNIL_ERROR", statusCode, provider, providerError) {
    super(message);
    this.name = "CarnilError";
    this.code = code;
    this.type = type;
    this.statusCode = statusCode;
    this.provider = provider;
    this.providerError = providerError;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _CarnilError);
    }
  }
};
var CarnilValidationError = class extends CarnilError {
  constructor(message, field) {
    super(
      field ? `Validation error in field '${field}': ${message}` : message,
      "VALIDATION_ERROR",
      "VALIDATION_ERROR",
      400
    );
    this.name = "CarnilValidationError";
  }
};
var CarnilAuthenticationError = class extends CarnilError {
  constructor(message = "Authentication failed", provider) {
    super(message, "AUTHENTICATION_ERROR", "AUTHENTICATION_ERROR", 401, provider);
    this.name = "CarnilAuthenticationError";
  }
};
var CarnilPermissionError = class extends CarnilError {
  constructor(message = "Insufficient permissions", provider) {
    super(message, "PERMISSION_ERROR", "PERMISSION_ERROR", 403, provider);
    this.name = "CarnilPermissionError";
  }
};
var CarnilNotFoundError = class extends CarnilError {
  constructor(resource, id, provider) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, "NOT_FOUND_ERROR", "NOT_FOUND_ERROR", 404, provider);
    this.name = "CarnilNotFoundError";
  }
};
var CarnilRateLimitError = class extends CarnilError {
  constructor(message = "Rate limit exceeded", retryAfter, provider) {
    super(message, "RATE_LIMIT_ERROR", "RATE_LIMIT_ERROR", 429, provider);
    this.name = "CarnilRateLimitError";
    this.retryAfter = retryAfter;
  }
};
var CarnilServerError = class extends CarnilError {
  constructor(message = "Internal server error", provider) {
    super(message, "SERVER_ERROR", "SERVER_ERROR", 500, provider);
    this.name = "CarnilServerError";
  }
};
var CarnilNetworkError = class extends CarnilError {
  constructor(message = "Network error", provider) {
    super(message, "NETWORK_ERROR", "NETWORK_ERROR", void 0, provider);
    this.name = "CarnilNetworkError";
  }
};
var CarnilTimeoutError = class extends CarnilError {
  constructor(message = "Request timeout", provider) {
    super(message, "TIMEOUT_ERROR", "TIMEOUT_ERROR", void 0, provider);
    this.name = "CarnilTimeoutError";
  }
};
var CarnilWebhookError = class extends CarnilError {
  constructor(message = "Webhook verification failed", provider) {
    super(message, "WEBHOOK_ERROR", "WEBHOOK_ERROR", 400, provider);
    this.name = "CarnilWebhookError";
  }
};
var CarnilProviderError = class extends CarnilError {
  constructor(message, provider, providerError, statusCode) {
    super(
      message,
      "PROVIDER_ERROR",
      "PROVIDER_ERROR",
      statusCode,
      provider,
      providerError
    );
    this.name = "CarnilProviderError";
  }
};
function createProviderError(provider, error, message) {
  const errorMessage = message || error.message || "Provider error occurred";
  return new CarnilProviderError(errorMessage, provider, error, error.statusCode);
}
function createValidationError(message, field) {
  return new CarnilValidationError(message, field);
}
function createNotFoundError(resource, id, provider) {
  return new CarnilNotFoundError(resource, id, provider);
}
function createRateLimitError(retryAfter, provider) {
  return new CarnilRateLimitError("Rate limit exceeded", retryAfter, provider);
}
function isCarnilError(error) {
  return error instanceof CarnilError;
}
function isCarnilValidationError(error) {
  return error instanceof CarnilValidationError;
}
function isCarnilAuthenticationError(error) {
  return error instanceof CarnilAuthenticationError;
}
function isCarnilPermissionError(error) {
  return error instanceof CarnilPermissionError;
}
function isCarnilNotFoundError(error) {
  return error instanceof CarnilNotFoundError;
}
function isCarnilRateLimitError(error) {
  return error instanceof CarnilRateLimitError;
}
function isCarnilServerError(error) {
  return error instanceof CarnilServerError;
}
function isCarnilNetworkError(error) {
  return error instanceof CarnilNetworkError;
}
function isCarnilTimeoutError(error) {
  return error instanceof CarnilTimeoutError;
}
function isCarnilWebhookError(error) {
  return error instanceof CarnilWebhookError;
}
function isCarnilProviderError(error) {
  return error instanceof CarnilProviderError;
}
function handleError(error, provider) {
  if (isCarnilError(error)) {
    return error;
  }
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    switch (status) {
      case 400:
        return new CarnilValidationError(error.message || "Bad request", provider);
      case 401:
        return new CarnilAuthenticationError(error.message || "Authentication failed", provider);
      case 403:
        return new CarnilPermissionError(error.message || "Insufficient permissions", provider);
      case 404:
        return new CarnilNotFoundError("Resource", void 0, provider);
      case 429:
        return new CarnilRateLimitError(error.message || "Rate limit exceeded", error.retryAfter, provider);
      case 500:
      case 502:
      case 503:
      case 504:
        return new CarnilServerError(error.message || "Server error", provider);
      default:
        return createProviderError(provider || "unknown", error);
    }
  }
  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return new CarnilNetworkError(error.message || "Network error", provider);
  }
  if (error.code === "ETIMEDOUT" || error.name === "TimeoutError") {
    return new CarnilTimeoutError(error.message || "Request timeout", provider);
  }
  return createProviderError(provider || "unknown", error);
}

// src/carnil.ts
var DefaultProviderRegistry = class {
  constructor() {
    this.providers = /* @__PURE__ */ new Map();
  }
  register(name, factory) {
    this.providers.set(name, factory);
  }
  get(name) {
    return this.providers.get(name);
  }
  list() {
    return Array.from(this.providers.keys());
  }
  unregister(name) {
    return this.providers.delete(name);
  }
  create(name, config) {
    const factory = this.providers.get(name);
    if (!factory) {
      throw new CarnilError(`Provider '${name}' not found`, "PROVIDER_NOT_FOUND");
    }
    if (typeof factory === "function") {
      return new factory(config);
    } else if (factory && typeof factory.create === "function") {
      return factory.create(config);
    } else {
      throw new CarnilError(
        `Invalid provider factory for '${name}'. Expected a class constructor or an object with a create method.`,
        "INVALID_PROVIDER_FACTORY"
      );
    }
  }
};
var _Carnil = class _Carnil {
  constructor(config) {
    this.config = config;
    this.provider = _Carnil.registry.create(config.provider.provider, config.provider);
  }
  // ========================================================================
  // Static Methods
  // ========================================================================
  static registerProvider(name, factory) {
    _Carnil.registry.register(name, factory);
  }
  static getRegisteredProviders() {
    return _Carnil.registry.list();
  }
  static createProvider(name, config) {
    return _Carnil.registry.create(name, config);
  }
  // ========================================================================
  // Provider Access
  // ========================================================================
  getProvider() {
    return this.provider;
  }
  getConfig() {
    return this.config;
  }
  // ========================================================================
  // Health Check
  // ========================================================================
  async healthCheck() {
    try {
      return await this.provider.healthCheck();
    } catch (error) {
      if (this.config.debug) {
        if (typeof console !== "undefined") {
          console.error("Health check failed:", error);
        }
      }
      return false;
    }
  }
  // ========================================================================
  // Customer Operations
  // ========================================================================
  async createCustomer(request) {
    try {
      const customer = await this.provider.createCustomer(request);
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async getCustomer(id) {
    try {
      const customer = await this.provider.retrieveCustomer({ id });
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async updateCustomer(id, request) {
    try {
      const customer = await this.provider.updateCustomer(id, request);
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async deleteCustomer(id) {
    try {
      await this.provider.deleteCustomer(id);
      return { data: void 0, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: void 0, success: false, error: carnilError.message };
    }
  }
  async listCustomers(request) {
    try {
      const customers = await this.provider.listCustomers(request);
      const listResponse = Array.isArray(customers) ? { data: customers, hasMore: false } : customers;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Payment Method Operations
  // ========================================================================
  async listPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.provider.listPaymentMethods({ customerId });
      return { data: paymentMethods, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }
  async attachPaymentMethod(customerId, paymentMethodId) {
    try {
      const paymentMethod = await this.provider.attachPaymentMethod(customerId, paymentMethodId);
      return { data: paymentMethod, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async detachPaymentMethod(paymentMethodId) {
    try {
      await this.provider.detachPaymentMethod(paymentMethodId);
      return { data: void 0, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: void 0, success: false, error: carnilError.message };
    }
  }
  async setDefaultPaymentMethod(customerId, paymentMethodId) {
    try {
      const paymentMethod = await this.provider.setDefaultPaymentMethod(
        customerId,
        paymentMethodId
      );
      return { data: paymentMethod, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Payment Intent Operations
  // ========================================================================
  async createPaymentIntent(request) {
    try {
      const paymentIntent = await this.provider.createPaymentIntent(request);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async getPaymentIntent(id) {
    try {
      const paymentIntent = await this.provider.getPaymentIntent(id);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async updatePaymentIntent(id, updates) {
    try {
      const paymentIntent = await this.provider.updatePaymentIntent(id, updates);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async cancelPaymentIntent(id) {
    try {
      const paymentIntent = await this.provider.cancelPaymentIntent(id);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async confirmPaymentIntent(id, paymentMethodId) {
    try {
      const paymentIntent = await this.provider.confirmPaymentIntent(id, paymentMethodId);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async capturePaymentIntent(id, amount) {
    try {
      const paymentIntent = await this.provider.capturePaymentIntent(id, amount);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async listPaymentIntents(request) {
    try {
      const paymentIntents = await this.provider.listPaymentIntents(request);
      const listResponse = Array.isArray(paymentIntents) ? { data: paymentIntents, hasMore: false } : paymentIntents;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Subscription Operations
  // ========================================================================
  async createSubscription(request) {
    try {
      const subscription = await this.provider.createSubscription(request);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async getSubscription(id) {
    try {
      const subscription = await this.provider.getSubscription(id);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async updateSubscription(id, updates) {
    try {
      const subscription = await this.provider.updateSubscription(id, updates);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async cancelSubscription(id) {
    try {
      const subscription = await this.provider.cancelSubscription(id);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async listSubscriptions(request) {
    try {
      const subscriptions = await this.provider.listSubscriptions(request);
      const listResponse = Array.isArray(subscriptions) ? { data: subscriptions, hasMore: false } : subscriptions;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Invoice Operations
  // ========================================================================
  async createInvoice(request) {
    try {
      const invoice = await this.provider.createInvoice(request);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async getInvoice(id) {
    try {
      const invoice = await this.provider.getInvoice(id);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async updateInvoice(id, updates) {
    try {
      const invoice = await this.provider.updateInvoice(id, updates);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async finalizeInvoice(id) {
    try {
      const invoice = await this.provider.finalizeInvoice(id);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async payInvoice(id, paymentMethodId) {
    try {
      const invoice = await this.provider.payInvoice(id, paymentMethodId);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async listInvoices(request) {
    try {
      const invoices = await this.provider.listInvoices(request);
      const listResponse = Array.isArray(invoices) ? { data: invoices, hasMore: false } : invoices;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Refund Operations
  // ========================================================================
  async createRefund(request) {
    try {
      const refund = await this.provider.createRefund(request);
      return { data: refund, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async getRefund(id) {
    try {
      const refund = await this.provider.getRefund(id);
      return { data: refund, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null, success: false, error: carnilError.message };
    }
  }
  async listRefunds(paymentId) {
    try {
      const refunds = await this.provider.listRefunds({ paymentId });
      return { data: refunds, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }
  // ========================================================================
  // Webhook Operations
  // ========================================================================
  async verifyWebhook(payload, signature, secret) {
    try {
      return await this.provider.verifyWebhook(payload, signature, secret);
    } catch (error) {
      if (this.config.debug) {
        if (typeof console !== "undefined") {
          console.error("Webhook verification failed:", error);
        }
      }
      return false;
    }
  }
  async parseWebhook(payload, signature, secret) {
    try {
      return await this.provider.parseWebhook(payload, signature, secret);
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      throw carnilError;
    }
  }
  // ========================================================================
  // Analytics Operations
  // ========================================================================
  async trackUsage(metrics) {
    try {
      await this.provider.trackUsage(metrics);
      return { data: void 0, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: void 0, success: false, error: carnilError.message };
    }
  }
  async trackAIUsage(metrics) {
    try {
      await this.provider.trackAIUsage(metrics);
      return { data: void 0, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: void 0, success: false, error: carnilError.message };
    }
  }
  async getUsageMetrics(customerId, featureId, period) {
    try {
      const metrics = await this.provider.getUsageMetrics(customerId, featureId, period);
      return { data: metrics, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }
  async getAIUsageMetrics(customerId, modelId, period) {
    try {
      const metrics = await this.provider.getAIUsageMetrics(customerId, modelId, period);
      return { data: metrics, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }
};
_Carnil.registry = new DefaultProviderRegistry();
var Carnil = _Carnil;
var CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  deleted: z.boolean().optional(),
  // Provider-specific fields
  provider: z.string(),
  providerId: z.string()
});
var PaymentMethodSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.enum(["card", "bank_account", "upi", "wallet", "netbanking", "emi"]),
  brand: z.string().optional(),
  // visa, mastercard, etc.
  last4: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  isDefault: z.boolean().default(false),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string()
});
var PaymentIntentSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum([
    "requires_payment_method",
    "requires_confirmation",
    "requires_action",
    "processing",
    "requires_capture",
    "canceled",
    "succeeded",
    "failed"
  ]),
  clientSecret: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional(),
  receiptEmail: z.string().optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string()
});
var SubscriptionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: z.enum([
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "paused"
  ]),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean().default(false),
  canceledAt: z.date().optional(),
  trialStart: z.date().optional(),
  trialEnd: z.date().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string()
});
var InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  status: z.enum(["draft", "open", "paid", "void", "uncollectible"]),
  amount: z.number(),
  currency: z.string(),
  amountPaid: z.number().default(0),
  amountDue: z.number(),
  subtotal: z.number(),
  tax: z.number().default(0),
  total: z.number(),
  description: z.string().optional(),
  hostedInvoiceUrl: z.string().optional(),
  invoicePdf: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  dueDate: z.date().optional(),
  paidAt: z.date().optional(),
  provider: z.string(),
  providerId: z.string()
});
var RefundSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "succeeded", "failed", "canceled"]),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string()
});
var DisputeSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum([
    "warning_needs_response",
    "warning_under_review",
    "warning_closed",
    "needs_response",
    "under_review",
    "charge_refunded",
    "won",
    "lost"
  ]),
  reason: z.enum([
    "credit_not_processed",
    "duplicate",
    "fraudulent",
    "general",
    "incorrect_account_details",
    "insufficient_funds",
    "product_not_received",
    "product_unacceptable",
    "subscription_canceled",
    "unrecognized"
  ]),
  evidence: z.record(z.any()).optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string()
});
var CreateCustomerRequestSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
});
var UpdateCustomerRequestSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
});
var CreatePaymentIntentRequestSchema = z.object({
  customerId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional(),
  receiptEmail: z.string().email().optional(),
  captureMethod: z.enum(["automatic", "manual"]).default("automatic")
});
var CreateSubscriptionRequestSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  trialPeriodDays: z.number().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional()
});
var CreateInvoiceRequestSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  dueDate: z.date().optional()
});
var CreateRefundRequestSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
});
var ListRequestSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  startingAfter: z.string().optional(),
  endingBefore: z.string().optional(),
  created: z.object({
    gte: z.date().optional(),
    lte: z.date().optional()
  }).optional()
});
var CustomerListRequestSchema = ListRequestSchema.extend({
  email: z.string().optional()
});
var PaymentIntentListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  status: z.string().optional()
});
var SubscriptionListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  status: z.string().optional()
});
var InvoiceListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  subscriptionId: z.string().optional(),
  status: z.string().optional()
});
var WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  created: z.date(),
  provider: z.string(),
  livemode: z.boolean()
});
var UsageMetricsSchema = z.object({
  customerId: z.string(),
  featureId: z.string(),
  usage: z.number(),
  limit: z.number().optional(),
  period: z.enum(["day", "week", "month", "year"]),
  startDate: z.date(),
  endDate: z.date(),
  metadata: z.record(z.string()).optional()
});
var AIUsageMetricsSchema = z.object({
  customerId: z.string(),
  modelId: z.string(),
  tokens: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  cost: z.number(),
  timestamp: z.date(),
  metadata: z.record(z.string()).optional()
});

export { AIUsageMetricsSchema, Carnil, CarnilAuthenticationError, CarnilError, CarnilNetworkError, CarnilNotFoundError, CarnilPermissionError, CarnilProviderError, CarnilRateLimitError, CarnilServerError, CarnilTimeoutError, CarnilValidationError, CarnilWebhookError, CreateCustomerRequestSchema, CreateInvoiceRequestSchema, CreatePaymentIntentRequestSchema, CreateRefundRequestSchema, CreateSubscriptionRequestSchema, CustomerListRequestSchema, CustomerSchema, DisputeSchema, InvoiceListRequestSchema, InvoiceSchema, ListRequestSchema, PaymentIntentListRequestSchema, PaymentIntentSchema, PaymentMethodSchema, RefundSchema, SubscriptionListRequestSchema, SubscriptionSchema, UpdateCustomerRequestSchema, UsageMetricsSchema, WebhookEventSchema, createNotFoundError, createProviderError, createRateLimitError, createValidationError, Carnil as default, handleError, isCarnilAuthenticationError, isCarnilError, isCarnilNetworkError, isCarnilNotFoundError, isCarnilPermissionError, isCarnilProviderError, isCarnilRateLimitError, isCarnilServerError, isCarnilTimeoutError, isCarnilValidationError, isCarnilWebhookError };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map
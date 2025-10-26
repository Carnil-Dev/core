'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var zod = require('zod');

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
var CustomerSchema = zod.z.object({
  id: zod.z.string(),
  email: zod.z.string().email().optional(),
  name: zod.z.string().optional(),
  phone: zod.z.string().optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  deleted: zod.z.boolean().optional(),
  // Provider-specific fields
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var PaymentMethodSchema = zod.z.object({
  id: zod.z.string(),
  customerId: zod.z.string(),
  type: zod.z.enum(["card", "bank_account", "upi", "wallet", "netbanking", "emi"]),
  brand: zod.z.string().optional(),
  // visa, mastercard, etc.
  last4: zod.z.string().optional(),
  expiryMonth: zod.z.number().optional(),
  expiryYear: zod.z.number().optional(),
  isDefault: zod.z.boolean().default(false),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var PaymentIntentSchema = zod.z.object({
  id: zod.z.string(),
  customerId: zod.z.string(),
  amount: zod.z.number(),
  currency: zod.z.string(),
  status: zod.z.enum([
    "requires_payment_method",
    "requires_confirmation",
    "requires_action",
    "processing",
    "requires_capture",
    "canceled",
    "succeeded",
    "failed"
  ]),
  clientSecret: zod.z.string().optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  paymentMethodId: zod.z.string().optional(),
  receiptEmail: zod.z.string().optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var SubscriptionSchema = zod.z.object({
  id: zod.z.string(),
  customerId: zod.z.string(),
  status: zod.z.enum([
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "paused"
  ]),
  currentPeriodStart: zod.z.date(),
  currentPeriodEnd: zod.z.date(),
  cancelAtPeriodEnd: zod.z.boolean().default(false),
  canceledAt: zod.z.date().optional(),
  trialStart: zod.z.date().optional(),
  trialEnd: zod.z.date().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var InvoiceSchema = zod.z.object({
  id: zod.z.string(),
  customerId: zod.z.string(),
  subscriptionId: zod.z.string().optional(),
  status: zod.z.enum(["draft", "open", "paid", "void", "uncollectible"]),
  amount: zod.z.number(),
  currency: zod.z.string(),
  amountPaid: zod.z.number().default(0),
  amountDue: zod.z.number(),
  subtotal: zod.z.number(),
  tax: zod.z.number().default(0),
  total: zod.z.number(),
  description: zod.z.string().optional(),
  hostedInvoiceUrl: zod.z.string().optional(),
  invoicePdf: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  dueDate: zod.z.date().optional(),
  paidAt: zod.z.date().optional(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var RefundSchema = zod.z.object({
  id: zod.z.string(),
  paymentId: zod.z.string(),
  amount: zod.z.number(),
  currency: zod.z.string(),
  status: zod.z.enum(["pending", "succeeded", "failed", "canceled"]),
  reason: zod.z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var DisputeSchema = zod.z.object({
  id: zod.z.string(),
  paymentId: zod.z.string(),
  amount: zod.z.number(),
  currency: zod.z.string(),
  status: zod.z.enum([
    "warning_needs_response",
    "warning_under_review",
    "warning_closed",
    "needs_response",
    "under_review",
    "charge_refunded",
    "won",
    "lost"
  ]),
  reason: zod.z.enum([
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
  evidence: zod.z.record(zod.z.any()).optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  created: zod.z.date(),
  updated: zod.z.date(),
  provider: zod.z.string(),
  providerId: zod.z.string()
});
var CreateCustomerRequestSchema = zod.z.object({
  email: zod.z.string().email().optional(),
  name: zod.z.string().optional(),
  phone: zod.z.string().optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional()
});
var UpdateCustomerRequestSchema = zod.z.object({
  email: zod.z.string().email().optional(),
  name: zod.z.string().optional(),
  phone: zod.z.string().optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional()
});
var CreatePaymentIntentRequestSchema = zod.z.object({
  customerId: zod.z.string(),
  amount: zod.z.number().positive(),
  currency: zod.z.string().length(3),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  paymentMethodId: zod.z.string().optional(),
  receiptEmail: zod.z.string().email().optional(),
  captureMethod: zod.z.enum(["automatic", "manual"]).default("automatic")
});
var CreateSubscriptionRequestSchema = zod.z.object({
  customerId: zod.z.string(),
  priceId: zod.z.string(),
  trialPeriodDays: zod.z.number().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  paymentMethodId: zod.z.string().optional()
});
var CreateInvoiceRequestSchema = zod.z.object({
  customerId: zod.z.string(),
  subscriptionId: zod.z.string().optional(),
  amount: zod.z.number().positive(),
  currency: zod.z.string().length(3),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional(),
  dueDate: zod.z.date().optional()
});
var CreateRefundRequestSchema = zod.z.object({
  paymentId: zod.z.string(),
  amount: zod.z.number().positive().optional(),
  reason: zod.z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
  description: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string()).optional()
});
var ListRequestSchema = zod.z.object({
  limit: zod.z.number().min(1).max(100).default(10),
  startingAfter: zod.z.string().optional(),
  endingBefore: zod.z.string().optional(),
  created: zod.z.object({
    gte: zod.z.date().optional(),
    lte: zod.z.date().optional()
  }).optional()
});
var CustomerListRequestSchema = ListRequestSchema.extend({
  email: zod.z.string().optional()
});
var PaymentIntentListRequestSchema = ListRequestSchema.extend({
  customerId: zod.z.string().optional(),
  status: zod.z.string().optional()
});
var SubscriptionListRequestSchema = ListRequestSchema.extend({
  customerId: zod.z.string().optional(),
  status: zod.z.string().optional()
});
var InvoiceListRequestSchema = ListRequestSchema.extend({
  customerId: zod.z.string().optional(),
  subscriptionId: zod.z.string().optional(),
  status: zod.z.string().optional()
});
var WebhookEventSchema = zod.z.object({
  id: zod.z.string(),
  type: zod.z.string(),
  data: zod.z.record(zod.z.any()),
  created: zod.z.date(),
  provider: zod.z.string(),
  livemode: zod.z.boolean()
});
var UsageMetricsSchema = zod.z.object({
  customerId: zod.z.string(),
  featureId: zod.z.string(),
  usage: zod.z.number(),
  limit: zod.z.number().optional(),
  period: zod.z.enum(["day", "week", "month", "year"]),
  startDate: zod.z.date(),
  endDate: zod.z.date(),
  metadata: zod.z.record(zod.z.string()).optional()
});
var AIUsageMetricsSchema = zod.z.object({
  customerId: zod.z.string(),
  modelId: zod.z.string(),
  tokens: zod.z.number(),
  inputTokens: zod.z.number(),
  outputTokens: zod.z.number(),
  cost: zod.z.number(),
  timestamp: zod.z.date(),
  metadata: zod.z.record(zod.z.string()).optional()
});

exports.AIUsageMetricsSchema = AIUsageMetricsSchema;
exports.Carnil = Carnil;
exports.CarnilAuthenticationError = CarnilAuthenticationError;
exports.CarnilError = CarnilError;
exports.CarnilNetworkError = CarnilNetworkError;
exports.CarnilNotFoundError = CarnilNotFoundError;
exports.CarnilPermissionError = CarnilPermissionError;
exports.CarnilProviderError = CarnilProviderError;
exports.CarnilRateLimitError = CarnilRateLimitError;
exports.CarnilServerError = CarnilServerError;
exports.CarnilTimeoutError = CarnilTimeoutError;
exports.CarnilValidationError = CarnilValidationError;
exports.CarnilWebhookError = CarnilWebhookError;
exports.CreateCustomerRequestSchema = CreateCustomerRequestSchema;
exports.CreateInvoiceRequestSchema = CreateInvoiceRequestSchema;
exports.CreatePaymentIntentRequestSchema = CreatePaymentIntentRequestSchema;
exports.CreateRefundRequestSchema = CreateRefundRequestSchema;
exports.CreateSubscriptionRequestSchema = CreateSubscriptionRequestSchema;
exports.CustomerListRequestSchema = CustomerListRequestSchema;
exports.CustomerSchema = CustomerSchema;
exports.DisputeSchema = DisputeSchema;
exports.InvoiceListRequestSchema = InvoiceListRequestSchema;
exports.InvoiceSchema = InvoiceSchema;
exports.ListRequestSchema = ListRequestSchema;
exports.PaymentIntentListRequestSchema = PaymentIntentListRequestSchema;
exports.PaymentIntentSchema = PaymentIntentSchema;
exports.PaymentMethodSchema = PaymentMethodSchema;
exports.RefundSchema = RefundSchema;
exports.SubscriptionListRequestSchema = SubscriptionListRequestSchema;
exports.SubscriptionSchema = SubscriptionSchema;
exports.UpdateCustomerRequestSchema = UpdateCustomerRequestSchema;
exports.UsageMetricsSchema = UsageMetricsSchema;
exports.WebhookEventSchema = WebhookEventSchema;
exports.createNotFoundError = createNotFoundError;
exports.createProviderError = createProviderError;
exports.createRateLimitError = createRateLimitError;
exports.createValidationError = createValidationError;
exports.default = Carnil;
exports.handleError = handleError;
exports.isCarnilAuthenticationError = isCarnilAuthenticationError;
exports.isCarnilError = isCarnilError;
exports.isCarnilNetworkError = isCarnilNetworkError;
exports.isCarnilNotFoundError = isCarnilNotFoundError;
exports.isCarnilPermissionError = isCarnilPermissionError;
exports.isCarnilProviderError = isCarnilProviderError;
exports.isCarnilRateLimitError = isCarnilRateLimitError;
exports.isCarnilServerError = isCarnilServerError;
exports.isCarnilTimeoutError = isCarnilTimeoutError;
exports.isCarnilValidationError = isCarnilValidationError;
exports.isCarnilWebhookError = isCarnilWebhookError;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
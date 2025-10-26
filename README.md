# @carnil/core

[![npm version](https://badge.fury.io/js/%40carnil%2Fcore.svg)](https://badge.fury.io/js/%40carnil%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The core SDK for Carnil unified payments platform. This package provides the main `Carnil` class and all essential types, interfaces, and error handling for building payment applications.

## Features

- 🚀 **Unified API** - Single interface for multiple payment providers
- 🔧 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- 🛡️ **Error Handling** - Robust error handling with custom error types
- 🔌 **Provider System** - Pluggable provider architecture
- 📊 **Analytics** - Built-in usage tracking and analytics
- 🔐 **Webhook Support** - Secure webhook verification and parsing
- 💳 **Complete Payment Flow** - Customers, payment methods, intents, subscriptions, invoices, and refunds

## Installation

```bash
npm install @carnil/core
```

## Quick Start

```typescript
import { Carnil } from '@carnil/core';
import { StripeProvider } from '@carnil/stripe';

// Register a provider
Carnil.registerProvider('stripe', StripeProvider);

// Initialize Carnil
const carnil = new Carnil({
  provider: {
    provider: 'stripe',
    apiKey: 'sk_test_...',
    webhookSecret: 'whsec_...'
  },
  debug: true
});

// Create a customer
const customer = await carnil.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe'
});

// Create a payment intent
const paymentIntent = await carnil.createPaymentIntent({
  amount: 2000, // $20.00
  currency: 'usd',
  customerId: customer.data.id
});
```

## API Reference

### Core Class

#### `Carnil`

The main class for interacting with payment providers.

```typescript
class Carnil {
  constructor(config: CarnilConfig)
  
  // Static methods
  static registerProvider(name: string, factory: any): void
  static getRegisteredProviders(): string[]
  static createProvider(name: string, config: any): CarnilProvider
  
  // Instance methods
  getProvider(): CarnilProvider
  getConfig(): CarnilConfig
  healthCheck(): Promise<boolean>
}
```

### Customer Operations

```typescript
// Create a customer
const customer = await carnil.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe',
  metadata?: { customField: 'value' }
});

// Get a customer
const customer = await carnil.getCustomer('cus_123');

// Update a customer
const updatedCustomer = await carnil.updateCustomer('cus_123', {
  name: 'Jane Doe'
});

// Delete a customer
await carnil.deleteCustomer('cus_123');

// List customers
const customers = await carnil.listCustomers({
  limit: 10,
  startingAfter: 'cus_123'
});
```

### Payment Method Operations

```typescript
// List payment methods
const paymentMethods = await carnil.listPaymentMethods('cus_123');

// Attach payment method
const paymentMethod = await carnil.attachPaymentMethod('cus_123', 'pm_123');

// Detach payment method
await carnil.detachPaymentMethod('pm_123');

// Set default payment method
const defaultMethod = await carnil.setDefaultPaymentMethod('cus_123', 'pm_123');
```

### Payment Intent Operations

```typescript
// Create payment intent
const paymentIntent = await carnil.createPaymentIntent({
  amount: 2000,
  currency: 'usd',
  customerId: 'cus_123',
  paymentMethodId: 'pm_123'
});

// Get payment intent
const paymentIntent = await carnil.getPaymentIntent('pi_123');

// Update payment intent
const updatedIntent = await carnil.updatePaymentIntent('pi_123', {
  amount: 3000
});

// Confirm payment intent
const confirmedIntent = await carnil.confirmPaymentIntent('pi_123');

// Capture payment intent
const capturedIntent = await carnil.capturePaymentIntent('pi_123', 2000);

// Cancel payment intent
const cancelledIntent = await carnil.cancelPaymentIntent('pi_123');
```

### Subscription Operations

```typescript
// Create subscription
const subscription = await carnil.createSubscription({
  customerId: 'cus_123',
  priceId: 'price_123',
  paymentMethodId: 'pm_123'
});

// Get subscription
const subscription = await carnil.getSubscription('sub_123');

// Update subscription
const updatedSubscription = await carnil.updateSubscription('sub_123', {
  priceId: 'price_456'
});

// Cancel subscription
const cancelledSubscription = await carnil.cancelSubscription('sub_123');
```

### Invoice Operations

```typescript
// Create invoice
const invoice = await carnil.createInvoice({
  customerId: 'cus_123',
  items: [{
    priceId: 'price_123',
    quantity: 1
  }]
});

// Get invoice
const invoice = await carnil.getInvoice('in_123');

// Finalize invoice
const finalizedInvoice = await carnil.finalizeInvoice('in_123');

// Pay invoice
const paidInvoice = await carnil.payInvoice('in_123', 'pm_123');
```

### Refund Operations

```typescript
// Create refund
const refund = await carnil.createRefund({
  paymentId: 'pi_123',
  amount: 1000,
  reason: 'requested_by_customer'
});

// Get refund
const refund = await carnil.getRefund('re_123');

// List refunds
const refunds = await carnil.listRefunds('pi_123');
```

### Webhook Operations

```typescript
// Verify webhook
const isValid = await carnil.verifyWebhook(payload, signature, secret);

// Parse webhook
const event = await carnil.parseWebhook(payload, signature, secret);
```

### Analytics Operations

```typescript
// Track usage
await carnil.trackUsage({
  customerId: 'cus_123',
  featureId: 'api_calls',
  usage: 100,
  timestamp: new Date()
});

// Track AI usage
await carnil.trackAIUsage({
  customerId: 'cus_123',
  modelId: 'gpt-4',
  tokens: 1000,
  cost: 0.02
});

// Get usage metrics
const metrics = await carnil.getUsageMetrics('cus_123', 'api_calls', 'month');

// Get AI usage metrics
const aiMetrics = await carnil.getAIUsageMetrics('cus_123', 'gpt-4', 'month');
```

## Types

### Core Types

```typescript
interface CarnilConfig {
  provider: ProviderConfig;
  debug?: boolean;
}

interface CarnilResponse<T> {
  data: T | null;
  success: boolean;
  error?: string;
}

interface ListResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}
```

### Entity Types

```typescript
interface Customer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  card?: CardDetails;
  isDefault: boolean;
  createdAt: Date;
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  customerId?: string;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Subscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  reason?: string;
  createdAt: Date;
}
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import {
  CarnilError,
  CarnilValidationError,
  CarnilAuthenticationError,
  CarnilPermissionError,
  CarnilNotFoundError,
  CarnilRateLimitError,
  CarnilServerError,
  CarnilNetworkError,
  CarnilTimeoutError,
  CarnilWebhookError,
  CarnilProviderError
} from '@carnil/core';

try {
  const customer = await carnil.createCustomer({ email: 'invalid-email' });
} catch (error) {
  if (error instanceof CarnilValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof CarnilAuthenticationError) {
    console.error('Authentication error:', error.message);
  }
}
```

## Provider System

The SDK uses a pluggable provider system. You can register custom providers:

```typescript
import { CarnilProvider } from '@carnil/core';

class CustomProvider implements CarnilProvider {
  name = 'custom';
  
  async healthCheck(): Promise<boolean> {
    // Implementation
  }
  
  async createCustomer(request: CreateCustomerRequest): Promise<Customer> {
    // Implementation
  }
  
  // ... other methods
}

// Register the provider
Carnil.registerProvider('custom', CustomProvider);

// Use the provider
const carnil = new Carnil({
  provider: {
    provider: 'custom',
    // custom config
  }
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/Carnil-Dev/carnil-sdk/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [Carnil Team](https://carnil.dev)

## Support

- 📖 [Documentation](https://docs.carnil.dev)
- 💬 [Discord Community](https://discord.gg/carnil)
- 🐛 [Report Issues](https://github.com/Carnil-Dev/carnil-sdk/issues)
- 📧 [Email Support](mailto:hello@carnil.dev)

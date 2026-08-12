---
name: money-handling
description: Conventions for money values in this codebase. Use when writing
  or reviewing code that handles prices, payments, refunds, or currency.
---

# Money handling

- All monetary values are integer cents. Never floats, never strings.
- Use `Money.fromCents()` from `@acme/money` to construct values.

## Gotchas

- Legacy `orders.total_price` column is DECIMAL dollars — convert at the
  boundary with `Money.fromDecimalString()`, nowhere else.

---
name: money-handling
description: Conventions for money values in this codebase. Use when writing
  or reviewing code that handles prices, payments, refunds, or currency.
---

# Money handling

- All monetary values are integer cents. Never floats, never strings.
- Use `Money.fromCents()` from `@acme/money` to construct values.
- Rounding: half-even (banker's). `Money.allocate()` for splits.

## Gotchas

- Legacy `orders.total_price` column is DECIMAL dollars — convert at the
  boundary with `Money.fromDecimalString()`, nowhere else.
- The `/health` endpoint returns 200 even when the payment queue is down —
  check `queue_depth` in the response body instead.

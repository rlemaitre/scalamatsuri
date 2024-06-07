---
layout: default
---

Suppose you find this code in your codebase

```scala
case class IBAN(
    countryCode: String,
    checkDigits: String,
    bankCode: String,
    branchCode: String,
    accountNumber: String,
    nationalCheckDigit: String
)
```

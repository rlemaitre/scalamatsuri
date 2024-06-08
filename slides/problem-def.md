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

<!--

In a (not so) imaginary codebase, we found this class definition describing a bank account number

-->

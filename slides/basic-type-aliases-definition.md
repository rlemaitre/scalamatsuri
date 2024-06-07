---
layout: default
---

```scala
type CountryCode = String
type CheckDigits = String
type BankCode = String
type BranchCode = String
type AccountNumber = String
type NationalCheckDigit = String

case class IBAN(
    countryCode: CountryCode,
    checkDigits: CheckDigits,
    bankCode: BankCode,
    branchCode: BranchCode,
    accountNumber: AccountNumber,
    nationalCheckDigit: NationalCheckDigit
)
```

<!--
Pros

- Legibility

Cons

- Substitutions are possible
- No validation
-->


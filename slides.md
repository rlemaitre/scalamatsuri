---
theme: ./theme
lineNumbers: true
colorSchema: light
highlighter: shiki
titleTemplate: '%s'
info: |
  When designing an application, we often ends up with domain specific types, that all behold constraints that we try to enforce as much as possible : an age is positive, a delivery date can’t be in the past, etc. Modeling the data right is a part of the success of scala and functional programming in general, but it also brings either boilerplate (we have to do again and again validation), or rely purely on conventions.

  But there is hope. Meet the Iron library.

  Iron is, a type constraint library that allow us to have a safe, declarative and smarter model. It enable us to have a continuous stream of valid data from our API endpoints to the database, and removed a whole class of bugs. Using advanced features like opaque types, inlines and the new macro system, it offer a true 0 cost, 0 dependency library that don’t hamper compile time.

  In this talk, we’ll show first the different technique we can use to apply constraints is our domains. Then, we’ll present Iron, its features, extensions, and integrations. We’ll finish by showcasing a fully-integrated constraint-enforcing app.
author: Raphaël Lemaitre
presenter: true
download: true
export:
  format: pdf
  timeout: 30000
  dark: false
  withClicks: false
  withToc: false
remoteAssets: true
drawings:
  persist: false
selectable: true
fonts:
  sans: Rajdhani
  serif: Mate
  mono: Fira Code
themeConfig:
  primary: '#d32129'
  backgroundUrl: 'url(/images/background.png)'
  background: '#ffffff'
  paginationPagesDisabled: [1, 55]
  paginationX: r
  paginationY: t
layout: cover
coverDate: ''
title: Armored Type Safety with Iron
---

<h1 class="!text-5xl">Armored Type Safety</h1>
<h3>with</h3>
<h1 class="!text-9xl">Iron</h1>

<!--
Note
-->

---
layout: profile
speaker: Raphael Lemaitre
job: Senior Backend Staff Engineer
company: Ledger
tags: [Backend Blockchain, Scala, PostgreSQL]
blog:
    name: rlemaitre.com
    url: https://rlemaitre.com
website:
    name: ledger.com
    url: https://ledger.com
mail: raphael@rlemaitre.com
bluesky: "@rlemaitre.com"
twitter: "@rlemaitre_com"
image: /images/rlemaitre.png
---

---
layout: company
name: Ledger
logo: /images/ledger.svg
website:
    name: ledger.com
    url: https://ledger.com
tags: [Security, Self-custody]
---

<div class="grid grid-cols-1 justify-center items-center h-75">
    <div class="cornered w-90">
        <div class="align-left text-xl">
            <span class="float-left pr-5">
                <span class="text-3xl accent"><carbon-hashtag/></span>
                <span class="text-5em align-bottom font-600 accent">1</span>
            </span>
            technology platform in critical digital assets security and services for consumers, financial institutions and corporations
        </div>
    </div>
</div>

::logo::
<img src="/images/ledger.svg" width="250" class="">

<!--

-->

---
layout: company
name: Ledger
logo: /images/ledger.svg
website:
    name: ledger.com
    url: https://ledger.com
tags: [Security, Self-custody]
---

<div class="grid grid-cols-3 gap-2 w-full">
    <div class="flex-col cornered align-center text-center">
        <span class="text-6xl font-600 accent">650+</span>
        <p class="!m-0">
            employees
        </p>
    </div>
    <div class="flex-col cornered align-center text-center">
        <span class="text-6xl font-600 accent pb-0"> 9 </span>
        <p class="!m-0">
            locations
<!--
            <br>
            <emojione-flag-for-france/><emojione-flag-for-united-states/><emojione-flag-for-united-kingdom/><br>
            <emojione-flag-for-singapore/><emojione-flag-for-switzerland/>
-->
        </p>
    </div>
    <div class="flex-col cornered align-center text-center">
        <span class="text-6xl font-600 accent">70%</span>
        <p class="!m-0">
            R&D intensity
        </p>
    </div>
    <div class="flex-col cornered align-center text-center">
        <span class="text-6xl font-600 accent">20+</span>
        <p class="!m-0">
            Scala devs
        </p>
    </div>
    <div class="flex-col cornered align-center text-center">
        <span class="text-6xl font-600 accent">30K</span>
        <p class="!m-0">req/s</p>
    </div>
    <div class="flex-col align-center text-center" v-click>
        <img src="/images/join-us.png" class="brightness-90 h-150px w-auto"/>
    </div>
</div>
::logo::
<img src="/images/ledger.svg" width="250" class="">

<!--

-->

---
layout: cover
coverDate:
---

<h1 class="!text-8xl">Once upon a time,</h1>
<h2 class="!text-3xl">in a codebase far, far away...</h2>

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

---
layout: default
---

This looks good

```scala
val iban = IBAN(
    "FR",
    "14",
    "20041",
    "01005",
    "0500013M026",
    "06"
)
```

---
layout: default
---

Until you find something like this

```scala
val shuffled = IBAN(
    "0500013M026",
    "FR",
    "06",
    "14",
    "20041",
    "01005"
)
```

---
layout: default
---

So, you try this

```scala
val wtf = IBAN(
    "🇫🇷",
    "✅",
    "🏦",
    "🌳",
    "🧾",
    "🤡"
)
```

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">We can do</h2>
<h1 class="!text-8xl">Better</h1>

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Maybe with</h2>
<h1 class="!text-8xl">Type</h1>
<h1 class="!text-8xl">Aliases</h1>

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
---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Maybe with</h2>
<h1 class="!text-8xl">Value</h1>
<h1 class="!text-8xl">classes</h1>

---
layout: default
---

```scala
case class CountryCode(value: String) extends AnyVal

case class CheckDigits(value: String) extends AnyVal

case class BankCode(value: String) extends AnyVal

case class BranchCode(value: String) extends AnyVal

case class AccountNumber(value: String) extends AnyVal

case class NationalCheckDigit(value: String) extends AnyVal
```

---
layout: default
---

This looks good

```scala
val iban = IBAN(
    CountryCode("FR"),
    CheckDigits("14"),
    BankCode("20041"),
    BranchCode("01005"),
    AccountNumber("0500013M026"),
    NationalCheckDigit("06")
)
```

---
layout: default
---

And this cannot compile anymore

```scala
val shuffled = IBAN(
    AccountNumber("0500013M026"),
    CountryCode("FR"),
    NationalCheckDigit("06"),
    CheckDigits("14"),
    BankCode("20041"),
    BranchCode("01005")
)
```

---
layout: default
---

But this one still compiles

```scala
val wtf = IBAN(
    CountryCode("🇫🇷"),
    CheckDigits("✅"),
    BankCode("🏦"),
    BranchCode("🌳"),
    AccountNumber("🧾"),
    NationalCheckDigit("🤡")
)
```

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Let's add</h2>
<h1 class="!text-8xl">validation</h1>

---
layout: default
---

```scala
case class CountryCode(str: String) extends AnyVal:
  require(str.length == 2, "Country code must be 2 chars")

case class CheckDigits(str: String) extends AnyVal:
  require(str.length == 2, "Check digits must be 2 chars")

case class BankCode(str: String) extends AnyVal:
  require(str.length == 5, "Bank code must be 5 chars")

case class BranchCode(str: String) extends AnyVal:
  require(str.length == 5, "Branch code must be 5 chars")

case class AccountNumber(str: String) extends AnyVal:
  require(str.length == 11, "Account number must be 11 chars")

case class NationalCheckDigit(str: String) extends AnyVal:
  require(str.length == 2, "National check digit must be 2 chars")
```

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Let's</h2>
<h1 class="!text-8xl">validate</h1>
<h2 class="!text-3xl">without</h2>
<h1 class="!text-8xl">crashing</h1>

---
layout: default
---

```scala
case class FormatError(reason: String)
  extends Exception(reason), NoStackTrace
```

---
layout: default
---

```scala {all|3,9,15|4-5,10-11,16-17|all}
case class CountryCode(value: String) extends AnyVal
object CountryCode:
  def parse(str: String): Either[FormatError, CountryCode] =
    Either.cond(str.length == 2, CountryCode(str),
      FormatError("Country code must be 2 chars"))

case class CheckDigits(value: String) extends AnyVal
object CheckDigits:
  def parse(str: String): Either[FormatError, CheckDigits] =
    Either.cond(str.length == 2, CheckDigits(str),
      FormatError("Check digits must be 2 chars"))

case class BankCode(value: String) extends AnyVal
object BankCode:
  def parse(str: String): Either[FormatError, BankCode] =
    Either.cond(str.length == 5, BankCode(str),
      FormatError("Bank code must be 5 chars"))
```

---
layout: default
---

```scala {all|3,9,15|4-5,10-11,16-17|all}
case class BranchCode(value: String) extends AnyVal
object BranchCode:
  def parse(str: String): Either[FormatError, BranchCode] =
    Either.cond(str.length == 5, BranchCode(str),
      FormatError("Branch code must be 5 chars"))

case class AccountNumber(value: String) extends AnyVal
object AccountNumber:
  def parse(str: String): Either[FormatError, AccountNumber] =
    Either.cond(str.length == 11, AccountNumber(str),
      FormatError("Account number must be 11 chars"))

case class NationalCheckDigit(value: String) extends AnyVal
object NationalCheckDigits:
  def parse(str: String): Either[FormatError, NationalCheckDigits] =
    Either.cond(str.length == 2, NationalCheckDigits(str),
      FormatError("Notional check digits must be 2 chars"))
```

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">What about</h2>
<h1 class="!text-8xl">Opaque types</h1>

---
layout: default
---

```scala
opaque type BranchCode <: String = String
object BranchCode:
    inline def wrap(input: String): BranchCode = input
    
    extension(value: BranchCode)
        inline def unwrap: String = value
    
    def parse(input: String): Either[FormatError, BranchCode] =
      Either.cond(input.length == 5, wrap(input),
        FormatError("Branch code must be 5 chars"))
```

---
layout: default
---

# Summary

|               |            <carbon-view/><sup>1</sup>             | <material-symbols-light-format-list-numbered/><sup>2</sup> |      <carbon-certificate-check/><sup>3</sup>      | <material-symbols-light-switch-access-2-outline/><sup>4</sup> |          <carbon-meter-alt/><sup>5</sup>          |   <tdesign-shrink-vertical/><sup>6</sup>    |
|:-------------:|:-------------------------------------------------:|:----------------------------------------------------------:|:-------------------------------------------------:|:-------------------------------------------------------------:|:-------------------------------------------------:|:-------------------------------------------:|
|  Raw Classes  |    <carbon-close-filled class="text-red-600"/>    |        <carbon-close-filled class="text-red-600"/>         |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    | <carbon-close-filled class="text-red-600"/> |
| Type Aliases  | <carbon-checkmark-filled class="text-green-600"/> |        <carbon-close-filled class="text-red-600"/>         |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    | <carbon-close-filled class="text-red-600"/> |
| Value Classes | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    | <carbon-close-filled class="text-red-600"/> |
| VC + Require  | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    | <carbon-close-filled class="text-red-600"/> |
|  VC + Either  | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |       <carbon-checkmark-filled class="text-green-600"/>       |    <carbon-close-filled class="text-red-600"/>    | <carbon-close-filled class="text-red-600"/> |
| Opaque types  | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |       <carbon-checkmark-filled class="text-green-600"/>       | <carbon-checkmark-filled class="text-green-600"/> | <carbon-close-filled class="text-red-600"/> |

<footnotes separator="false" justify="evenly">
    <footnote number="1">Legibility</footnote>
    <footnote number="2">Strict Order</footnote>
    <footnote number="3">Validation</footnote>
    <footnote number="4">Referential Transparency</footnote>
    <footnote number="5">Performance</footnote>
    <footnote number="6">Conciseness</footnote>
</footnotes>

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Less Boilerplate,</h2>
<h1 class="!text-8xl">Smarter Design</h1>

---
layout: default
---

<img src="/images/iron.svg" style="filter: brightness(85%)">

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">What is</h2>
<h1 class="!text-9xl">Iron?</h1>

---
layout: default
---

# What is Iron?

<div class="w-full h-full grid grid-cols-1 content-evenly">
    <div class="flex flex-col cornered text-center">Composable type constraint library</div>
    <div class="flex flex-col cornered text-center">Enabling binding constraints to a specific type</div>
    <div class="flex flex-col cornered text-center">Created in Scala 3 by Raphaël Fromentin</div>
</div>

---
layout: default
---

# What is Iron?

Composable type **constraint** library

```scala {1|3-7}
final class Positive

import io.github.iltotore.iron.*

given Constraint[Int, Positive] with
  override inline def test(value: Int): Boolean = value > 0
  override inline def message: String = "Should be strictly positive"




//
```

---
layout: default
---

# What is Iron?

Composable **type constraint** library

```scala {9}
final class Positive

import io.github.iltotore.iron.*

given Constraint[Int, Positive] with
  override inline def test(value: Int): Boolean = value > 0
  override inline def message: String = "Should be strictly positive"

val x: Int :| Positive = 1


//
```

---
layout: default
---

# What is Iron?

Composable **type constraint** library

```scala {10-11}
final class Positive

import io.github.iltotore.iron.*

given Constraint[Int, Positive] with
  override inline def test(value: Int): Boolean = value > 0
  override inline def message: String = "Should be strictly positive"

val x: Int :| Positive = 1
//Compile-time error: Should be strictly positive
val y: Int :| Positive = -1
//
```

---
layout: default
---

# What is Iron?

**Composable type constraint** library

```scala {7}
final class Positive
// ...
val x: Int :| Positive = 1
//Compile-time error: Should be strictly positive
val y: Int :| Positive = -1

val foo: Int :| (Positive & Less[42]) = 1




//
```

---
layout: default
---

# What is Iron?

**Composable type constraint** library

```scala {8-9}
final class Positive
// ...
val x: Int :| Positive = 1
//Compile-time error: Should be strictly positive
val y: Int :| Positive = -1

val foo: Int :| (Positive & Less[42]) = 1
//Compile-time error: Should be strictly positive
val bar: Int :| (Positive & Less[42]) = -1


//
```

---
layout: default
---

# What is Iron?

**Composable type constraint** library

```scala {10-11}
final class Positive
// ...
val x: Int :| Positive = 1
//Compile-time error: Should be strictly positive
val y: Int :| Positive = -1

val foo: Int :| (Positive & Less[42]) = 1
//Compile-time error: Should be strictly positive
val bar: Int :| (Positive & Less[42]) = -1
//Compile-time error: Should be less than 42
val baz: Int :| (Positive & Less[42]) = 123
//
```

---
layout: cover
coverDate:
---

<h1 class="!text-8xl">Validation</h1>

---
layout: default
---

```scala
val value = 42
val x: Int :| Greater[0] = value
```
<v-click>
  <div class="absolute left-40 right-40 pt-5 pl-5 bg-warmgray-900 bg-op-90 text-size-xs text-red-600 text-left">
    <pre>
––– Constraint Error ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
Cannot refine value at compile-time because the predicate cannot be evaluated.
This is likely because the condition or the input value isn't fully inlined.
To test a constraint at runtime, use one of the `refine...` extension methods.
Inlined input: scratch_22.sc.value
Inlined condition: ((scratch_22.sc.value.>(0.0): scala.Boolean): scala.Boolean)
Message: Should be strictly positive
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    </pre>
  </div>
</v-click>

---
layout: default
---

# We have two ways

```scala
inline val value = 42
val x: Int :| Greater[0] = value
```

<div class="text-center text-2xl uppercase">– or –</div>

```scala
val value = 42
val x: Int :| Greater[0] = value.refineUnsafe
```


---
layout: default
---


```scala
val value = -42
val x: Int :| Greater[0] = value.refineUnsafe
```

<v-click>
  <div class="absolute left-40 right-40 bg-warmgray-900 bg-op-90 text-size-3xl text-red-600 text-left">
    <div class="h-full w-full self-center text-center align-middle p-14">
      <mdi-robot-dead-outline/> IllegalArgumentException <mdi-robot-dead-outline/>
    </div>
  </div>
</v-click>

<!--
Imperative

Illegal argument exception
-->

---
layout: default
---

What if the value is known at runtime?

```scala
def createIBAN(  countryCode: String,
                 checkDigits: String,
                 bankCode: String,
                 branchCode: String,
                 accountNumber: String,
                 nationalCheckDigit: String
              ): Either[String, User] =
  for
    ctr <- countryCode.refineEither[Alphanumeric & Length[Equals[2]]]
    chk <- checkDigits.refineEither[Alphanumeric & Length[Equals[2]]]
    ban <- bankCode.refineEither[Alphanumeric & Length[Equals[5]]]
    bra <- branchCode.refineEither[Alphanumeric & Length[Equals[5]]]
    acc <- accountNumber.refineEither[Alphanumeric & Length[Equals[11]]]
    nck <- nationalCheckDigit.refineEither[Alphanumeric & Length[Equals[2]]]
  yield IBAN(ctr, chk, ban, bra, acc, nck)
```

<!--

Functional

-->

---
layout: default
---

# Constrained Opaque Types

No implementation leak

```scala
opaque type Positive <: Int  = Int :| Greater[0]

object Positive extends RefinedTypeOps[Int, Greater[0], Positive]


// ...
```

---
layout: default
---

# Constrained Opaque Types

Constraint factorization

```scala
private type SatsConstraint =
  GreaterEqual[0] & LessEqual[100000000 * 21000000]

opaque type Sats <: Long = Long :| SatsConstraint

object Sats extends RefinedTypeOps[Long, SatsConstraint, Sats]
```

---
layout: default
---
# Summary


|                                          |            <carbon-view/><sup>1</sup>             | <material-symbols-light-format-list-numbered/><sup>2</sup> |      <carbon-certificate-check/><sup>3</sup>      | <material-symbols-light-switch-access-2-outline/><sup>4</sup> |          <carbon-meter-alt/><sup>5</sup>          |      <tdesign-shrink-vertical/><sup>6</sup>       | <fluent-text-box-settings-20-regular/><sup>7</sup> |
|:----------------------------------------:|:-------------------------------------------------:|:----------------------------------------------------------:|:-------------------------------------------------:|:-------------------------------------------------------------:|:-------------------------------------------------:|:-------------------------------------------------:|:--------------------------------------------------:|
|               Raw Classes                |    <carbon-close-filled class="text-red-600"/>    |        <carbon-close-filled class="text-red-600"/>         |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
|               Type Aliases               | <carbon-checkmark-filled class="text-green-600"/> |        <carbon-close-filled class="text-red-600"/>         |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
|              Value Classes               | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      |    <carbon-close-filled class="text-red-600"/>    |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
|               VC + Require               | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |          <carbon-close-filled class="text-red-600"/>          |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
|               VC + Either                | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |       <carbon-checkmark-filled class="text-green-600"/>       |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
|               Opaque types               | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |       <carbon-checkmark-filled class="text-green-600"/>       | <carbon-checkmark-filled class="text-green-600"/> |    <carbon-close-filled class="text-red-600"/>    |    <carbon-close-filled class="text-red-600"/>     |
| <span class="accent fw-bold">Iron</span> | <carbon-checkmark-filled class="text-green-600"/> |     <carbon-checkmark-filled class="text-green-600"/>      | <carbon-checkmark-filled class="text-green-600"/> |       <carbon-checkmark-filled class="text-green-600"/>       | <carbon-checkmark-filled class="text-green-600"/> | <carbon-checkmark-filled class="text-green-600"/> | <carbon-checkmark-filled class="text-green-600"/>  |

<footnotes separator="false" justify="evenly">
    <footnote number="1">Legibility</footnote>
    <footnote number="2">Strict Order</footnote>
    <footnote number="3">Validation</footnote>
    <footnote number="4">Referential Transparency</footnote>
    <footnote number="5">Performance</footnote>
    <footnote number="6">Conciseness</footnote>
    <footnote number="7">Compile-Time checking</footnote>
</footnotes>
---
layout: cover
coverDate:
---

<h1 class="!text-8xl">Iron</h1>

<div class="w-full flex flex-col items-center"><img src="/images/scalalove-logo.svg" width="150"/></div>

<h1 class="!text-8xl">Ecosystem</h1>

---
layout: default
---

# Refinement outputs

<div class="grid grid-cols-2">
    <div class="cornered">
        <img src="/images/cats.png" class="m-auto mb-7 h-50px"/>
        <p>
            <code>Validated</code>
        </p>
        <p>
            <code>Either</code> + <code>Parallel[F]</code>
        </p>
    </div>
    <div class="cornered">
        <img src="/images/zio.png" class="m-auto mb-7 h-50px"/>
        <p>
            <code>Validation</code>    
        </p>
    </div>
</div>
---
layout: default
---

# Typeclasses instances

<div class="grid grid-cols-3 justify-evenly">
    <div class="cornered text-center">
        <h3>Endpoints</h3>
        <ul>
            <li class="list-none">
                Tapir
            </li>
        </ul>
    </div>
    <div class="cornered text-center">
        <h3>JSON</h3>
        <ul>
            <li class="list-none" style="line-height: 1.5em;">Borer</li>
            <li class="list-none" style="line-height: 1.5em;">Circe</li>
            <li class="list-none" style="line-height: 1.5em;">Jsoniter</li>
            <li class="list-none" style="line-height: 1.5em;">uPickle</li>
            <li class="list-none" style="line-height: 1.5em;">ZIO-JSON</li>
        </ul>
    </div>
    <div class="cornered text-center">
        <h3>Databases</h3>
        <ul>
            <li class="list-none">
                Doobie
            </li>
            <li class="list-none">
                Skunk
            </li>
        </ul>
    </div>
    <div class="cornered text-center">
        <h3>Config</h3>
        <ul>
            <li class="list-none">
                Ciris
            </li>
        </ul>
    </div>
    <div class="cornered text-center">
        <h3>Tests</h3>
        <ul>
            <li class="list-none">
                Scalacheck
            </li>
        </ul>
    </div>
    <div class="cornered text-center">
        <h3>CLI</h3>
        <ul>
            <li class="list-none">
                Decline
            </li>
        </ul>
    </div>
</div>

---
layout: default
---

# Domain model

```scala
final case class Tag(name: Tag.Name, value: Tag.Value)

object Tag:
  private type NameConstraint = Not[Empty] & MaxLength[128]
  opaque type Name <: String  = String :| NameConstraint

  object Name extends RefinedTypeOps[String, NameConstraint, Name]

  private type ValueConstraint = Not[Empty] & MaxLength[512]
  opaque type Value <: String  = String :| ValueConstraint

  object Value extends RefinedTypeOps[String, ValueConstraint, Value]
```

---
layout: default
---

# Tapir

```scala
val getLatest = base
  .name("Get latest account addresses")
  .in(query[Option[Tag]]("tag"))
  .get
  .in("latest")
  .out(jsonBody[Option[AddressView]])
```

---
layout: default
---

# Doobie

```scala
def getLatestByTag(account: AccountId, name: Tag.Name, value: Tag.Value): 
    ConnectionIO[Option[Position]] =
  sql"""
  select
    account_id,
    address,
    coalesce(
      (select jsonb_object_agg(tag_name, tag_value order by tag_name) 
       from position_tags pt where p.position_id = pt.position_id),
      '{}'::jsonb),
    sync_status
  from positions p left join position_tags pt using (position_id)
  where account_id = $account
    and tag_name   = $name
    and tag_value  = $value
  order by position_id desc limit 1
  """.query[Position].option
```

---
layout: cover
coverDate: ''
---

<h2 class="!text-3xl">How to</h2>
<h1 class="!text-8xl">write</h1>
<h2 class="!text-3xl">an</h2>
<h1 class="!text-8xl">Integration?</h1>

---
layout: default
---

# Doobie

```scala
inline given [A, C]
  (using inline meta: Meta[A])
  (using Constraint[A, C], Show[A]): Meta[A :| C] =
    meta.tiemap[A :| C](_.refineEither)(identity)

inline given [T]
  (using m: RefinedTypeOps.Mirror[T], ev: Meta[m.IronType]): Meta[T] =
    ev.asInstanceOf[Meta[T]]
```

---
layout: cover
coverDate: ''
---

<h1 class="!text-8xl">Takeways</h1>

---
layout: default
---

# Takeaways


<div class="w-full h-full grid grid-cols-3 content-evenly">
    <div class="flex flex-col col-span-3 w-full">
        <quote author="Yaron Minsky" work="Effective ML Revisited">
            <p class="text-3xl">Making illegal states unrepresentable</p>
        </quote>
    </div>
    <div class="flex flex-col text-xl cornered" v-click>Reduced the feedback loop to minimum</div>
    <div class="flex flex-col text-xl cornered" v-click>Noticeably increased the reliability of our code</div>
    <div class="flex flex-col text-xl cornered" v-click>Scala 3 type system is incredibly powerful</div>
</div>

---
layout: cover
coverDate: ''
---

<h1>Any questions?</h1>

<figure class="flex justify-center items-center text-center">
  <img alt="Slides available at https://scalamatsuri.rlemaitre.com" src="/images/qrcode-slides.png" width="250"/>
</figure>
<a href="https://scalamatsuri.rlemaitre.com">https://scalamatsuri.rlemaitre.com</a>

<h1>Thank you!</h1>


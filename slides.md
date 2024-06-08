---
theme: .
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
  enabled: false
selectable: true
fonts:
  sans: Rajdhani
  serif: Mate
  mono: Fira Code
themeConfig:
  primary: '#d32129'
  backgroundUrl: 'url(/images/background.png)'
  # background: '#ffffff'
  paginationPagesDisabled: [1, 55]
  paginationX: r
  paginationY: t
src: ./slides/title.md
---

---
src: ./slides/rlemaitre.md
---

---
src: ./slides/ledger-desc.md
---

---
src: ./slides/ledger-numbers.md
---

---
src: ./slides/problem-title.md
---

---
src: "./slides/problem-def.md"
---

---
src: ./slides/problem-happy-path.md
---

---
src: ./slides/problem-switch-params.md
---

---
src: ./slides/problem-with-emojis.md
---

---
src: ./slides/problem-to-basic.md
---

---
src: ./slides/basic-type-aliases-title.md
---

---
src: ./slides/basic-type-aliases-definition.md
---

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Maybe with</h2>
<h1 class="!text-8xl">Value</h1>
<h1 class="!text-8xl">classes</h1>

<!--
 Maybe we can try with Value classes
-->
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
<!--

We have to define a class for each field

-->
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
<!--

We can use them easily

-->
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
 <!--

And we can't switch parameters

-->
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
 <!--

But we can still have invalid values 

-->
---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Let's add</h2>
<h1 class="!text-8xl">validation</h1>

<!--

So we'll have to add data validation

-->
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
<!--

Here, we have basic validation (it could be better but I kept it simple for this talk)

And when an invalid value is passed, an exception is raised

-->
---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Let's</h2>
<h1 class="!text-8xl">validate</h1>
<h2 class="!text-3xl">without</h2>
<h1 class="!text-8xl">crashing</h1>

<!--

And if we want to handle correctly invalid values

-->
---
layout: default
---

```scala
case class FormatError(reason: String)
  extends Exception(reason), NoStackTrace
```
<!--

Then we define own own error type

-->
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
<!--

[CLICK]

And define a smart constructor

[CLICK]

And use Either to handle validation issues.

We could use other type classes such as `Validated` or `Validation`

-->

---
layout: default
---

```scala
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
<!--

And do this for all your value classes

-->
---
layout: cover
coverDate:
---

<h2 class="!text-3xl">What about</h2>
<h1 class="!text-8xl">Opaque types</h1>

<!--

As we're using Scala 3, why not using opaque types?

-->
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
<!--
So here is the code for a single type

We have here a zero-cost abstraction of your validated data type

It's still very verbose
-->
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

<!--

So if we want to summarize, you can see in this table how each strategy behaves in term of:

| Column | Property                 |
|-------:|:-------------------------|
| 1      | Legibility               |
| 2      | Strict Parameter Order   |
| 3      | Validation               |
| 4      | Referential Transparency |
| 5      | Performance              |
| 6      | Conciseness              |
| 7      | Compile-Time checking    |

We can see that no strategies respond to all what we want

-->
---
layout: cover
coverDate:
---

<h2 class="!text-3xl">Less Boilerplate,</h2>
<h1 class="!text-8xl">Smarter Design</h1>

<!--

There should be something smarter and shorter

-->
---
layout: default
---

<img src="/images/iron.svg" style="filter: brightness(85%)">

<!--

Meet Iron

-->

---
layout: cover
coverDate:
---

<h2 class="!text-3xl">What is</h2>
<h1 class="!text-9xl">Iron?</h1>

<!--

What is it?

-->
---
layout: default
---

# What is Iron?

<div class="w-full h-full grid grid-cols-1 content-evenly">
    <div class="flex flex-col cornered text-center">Composable type constraint library</div>
    <div class="flex flex-col cornered text-center">Enabling binding constraints to a specific type</div>
    <div class="flex flex-col cornered text-center">Created in Scala 3 by Raphaël Fromentin</div>
</div>

<!--

It's a composable type constraint library

That enable constraint binding to a specific type at compile time 

It's written using Scala 3 features such as new macros, inlines, extension methods

-->
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

<!--
How do we define a constraint?

First a constraint is just an empty class

[CLICK]

Then you define how the contraint behaves 

-->
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
<!--

Using it is simple as saying my type has a constraint

-->
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

<!--

And invalid literal values would lead to a compilation error 

-->
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
<!--

And we can compose constraints easily

-->
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

<!--

Here again invalid literal values lead to compilation error

-->
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

<!--

And message is different depending on the constraint that has been violated

-->
---
layout: cover
coverDate:
---

<h1 class="!text-8xl">Validation</h1>

<!--

How does validation behave?

-->
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

<!--

Here we have a simple code, the difference with previous code is just that value is not defined on the same line 

[CLICK]

But when we compile this code we have this compilation error

-->
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

<!--
To fix this, we have two solutions:

* Either inline the value
* Or use the `refineUnsafe` extension method 
-->

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
Anf when an invalid value is used,

[CLICK]

We have a Illegal argument exception at runtime

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

In real life, values are rarely known at compile time but at runtime.

So, how do we use Iron in a functional way?

Here, we're using a for-comprehension to parse all values and yield an `Either`

The problem here is that implementation of constraints leak to everywhere the type is used.

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

<!--

But thanks to Scala 3 opaque type we can hide the implementation

We define our opaque type as a subtype of our base type and apply the constraint(s)

Then, for ease the usage, we make the companion object extend `RefinedTypeOps` that provide utility methods.

-->

---
layout: default
---

# Constrained Opaque Types

Constraint factorization

```scala
// There can be only 21 millions BTC ever and 1 BTC = 100,000,000 satoshis

private type SatsConstraint =
  GreaterEqual[0] & LessEqual[21_000_000 * 100_000_000]

opaque type Sats <: Long = Long :| SatsConstraint

object Sats extends RefinedTypeOps[Long, SatsConstraint, Sats]
```
<!--
In real life code, we often want to reuse different constrains.

To de so, we can define an alias type and use it in data type definition.

Actually, here, you see an actual code of our codebase at Ledger:

we define satochi type and incoporate constraints
-->
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

<!--

So if I take the summary table we saw before we see that Iron fulfill all requirements we have

| Column | Property                 |
|-------:|:-------------------------|
| 1      | Legibility               |
| 2      | Strict Parameter Order   |
| 3      | Validation               |
| 4      | Referential Transparency |
| 5      | Performance              |
| 6      | Conciseness              |
| 7      | Compile-Time checking    |

-->

---
layout: cover
coverDate:
---

<h1 class="!text-8xl">Iron</h1>

<div class="w-full flex flex-col items-center"><img src="/images/scalalove-logo.svg" width="150"/></div>

<h1 class="!text-8xl">Ecosystem</h1>

<!--

We rarely write vanilla scala but use a lot of libraries.

Fortunately, Iron loves the Scala ecosystem 

-->

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

<!--

First whichever the effect system you use, Iron has an integration 

-->
---
layout: default
---

# Typeclasses instances

<div class="grid grid-cols-4 justify-evenly">
    <div class="cornered r-0.5rem p-0.5rem text-center"><material-symbols-light-lan-outline class="color-red-500"/> Tapir</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-json class="color-red-500"/> Borer</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-json class="color-red-500"/> Circe</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-json class="color-red-500"/> Jsoniter</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-json class="color-red-500"/> uPickle</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-json class="color-red-500"/> ZIO-JSON</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><material-symbols-light-database-outline class="color-red-500"/> Doobie</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><material-symbols-light-database-outline class="color-red-500"/> Skunk</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><carbon-gears class="color-red-500"/> Ciris</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><material-symbols-light-experiment-outline class="color-red-500" />Scalacheck</div>
    <div class="cornered r-0.5rem p-0.5rem text-center"><material-symbols-light-terminal class="color-red-500" />Decline</div>
</div>

<!--

And it has integration for a lot of utility libraries also
* Tapir
* One of the few JSON library
* Property-based tests
* Configuration
* CLI tools

-->
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

<!--

Now, I will show you how we use it in our codebase

Here we define a `Tag` class with a name that must be non empty and with a maximum of 128 characters

and a non-empty, 512 max characters-long value

-->

---
layout: default
---

# Tapir

```scala
import sttp.tapir.codec.iron.given

val getLatest = base
  .name("Get latest account addresses")
  .in(query[Option[Tag]]("tag"))
  .get
  .in("latest")
  .out(jsonBody[Option[AddressView]])
```

<!--

Then we use this class as a query parameter of an endpoint defined with tapir 

-->

---
layout: default
---

# Doobie

```scala
import io.github.iltotore.iron.given

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

<!--

And use it in our database queries (using doobie)

-->
---
layout: cover
coverDate: ''
---

<h2 class="!text-3xl">How to</h2>
<h1 class="!text-8xl">write</h1>
<h2 class="!text-3xl">an</h2>
<h1 class="!text-8xl">Integration?</h1>

<!--

OK but what if my preferred library isn't supported by Iron ?

It's simple, you can write your own integration

That's what we did as doobie support didn't exist when we started using Iron.

So, brace yourselef, I'm gonna show you the whole code of the integration

-->
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

<!--

There it is: 7 lines of formatted code 

We just define how to transform back and forth between the base type and the constrained type 

-->

---
layout: cover
coverDate: ''
---

<h1 class="!text-8xl">Takeways</h1>

<!--

So if you have to remember something about this talk 

-->
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

<!--

First Iron helps a lot with making illegal states unrepresentable

[CLICK]

It helps us a lot to reduce the feedback loop right to compile time 

[CLICK]

Increased the code reliability and legibility of our code 

[CLICK]

And most importantly Scala 3 type system is incredibly powerful so use it at its maximum

-->

---
layout: cover
coverDate: ''
---

<h1>Any questions?</h1>

<div class="grid grid-cols-2">
  <div>
    <figure class="flex justify-center items-center text-center">
      <img alt="Slides available at https://scalamatsuri.rlemaitre.com" src="/images/qrcode-slides.png" width="250"/>
    </figure>
    <a href="https://scalamatsuri.rlemaitre.com">https://scalamatsuri.rlemaitre.com</a>
  </div>
  <div class="grid grid-cols-1 justify-center content-center">
    <p>
      <a class="mx-2" href="https://rlemaitre.com" target="_blank">
        <material-symbols-light-home-outline-rounded class="text-red-600"/>
       rlemaitre.com 
      </a>
    </p>
    <p>
      <a class="mx-2" href="https://ledger.com" target="_blank">
        <material-symbols-light-business-center-outline-rounded class="text-red-600"/>
        ledger.com
      </a>
    </p>
    <p>
      <a class="mx-2" href="https://twitter.com/rlemaitre_com" target="_blank">
        <arcticons-x-twitter class="text-red-600"/> 
        rlemaitre_com
      </a>
    </p>
  </div>
</div>

<h1>Thank you!</h1>

<!--

That's the end of this talk, thank you

You can find these slides by flashing this QR code and there's multiple way to contact me
-->

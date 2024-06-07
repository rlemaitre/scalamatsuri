<script setup lang="ts">
import { Subtitles } from 'slidev-theme-viplay/types'

const contents = {
  jp_JP: {
    page1 :{
      click0: [
        'Ironライブラリで守られた型安全性',
      ],
    },
    page2 :{
      click0: [
        'Ledger社勤務の Raphael Lemaitre です',
      ],
    },
    page3 :{
      click0: [
        'デジタル資産のセキュリティサービスを提供する会社',
      ],
    },
    page4 :{
      click0: [
        '約650名が勤務、多くが R&D (リサーチと開発)',
      ],
      click1: [
        '募集しています',
      ]
    },
    page5 :{
      click0: [
        '昔々、遥か遠くのコードベースに',
      ],
    },
    page6 :{
      click0: [
        'こんなケースクラスがあって',
      ],
    },
    page7 :{
      click0: [
        '一見良く見える',
      ],
    },
    page8 :{
      click0: [
        '値が入れ替わってしまっても気づかない',
      ],
    },
    page9 :{
      click0: [
        'こんな馬鹿げたコードもコンパイルを通ってしまう',
      ],
    },
    page10 :{
      click0: [
        'もっと良くできる',
      ],
    },
    page11 :{
      click0: [
        '型エイリアスを使ってみましょう',
      ],
    },
    page12 :{
      click0: [
        '型エイリアスを使った例',
      ],
    },
    page13 :{
      click0: [
        '値クラスを使ってみましょう',
      ],
    },
    page14 :{
      click0: [
        '値クラスを使った例',
      ],
    },
    page15 :{
      click0: [
        'さっきのケースクラスはこうになる',
      ],
    },
    page16 :{
      click0: [
        'こういうコードはもうコンパイルが通らなくなった',
      ],
    },
    page17 :{
      click0: [
        'こういうのはまだコンパイルを通ってしまう',
      ],
    },
    page18 :{
      click0: [
        'バリデーションを足しましょう',
      ],
    },
    page19 :{
      click0: [
        'requireを足した例',
      ],
    },
    page20 :{
      click0: [
        'クラッシュしないように検証しましょう',
      ],
    },
    page21 :{
      click0: [
        'FormatErrorクラスを作る',
      ],
    },
    page22 :{
      click0: [
        'Exceptionを投げずにEitherを返します',
      ],
    },
    page23 :{
      click0: [
        'Exceptionを投げずにEitherを返します',
      ],
    },
    page24 :{
      click0: [
        'Opaque Typeも使ってみましょう',
      ],
    },
    page25 :{
      click0: [
        'Opaque Typeを使った例です',
      ],
    },
    page26 :{
      click0: [
        '(1)可読性 (2)厳格な順序 (3)検証 (4)参照透過性 (5)性能 (6)簡潔さ (7)コンパイル時のチェック',
      ],
    },
    page27 :{
      click0: [
        '冗長さを減らし、よりスマートなデザイン',
      ],
    },
    page28 :{
      click0: [
        '',
      ],
    },
    page29 :{
      click0: [
        'Iron とは?',
      ],
    },
    page30 :{
      click0: [
        '組み合わせ可能な型制約ライブラリ、特定の型にバインドできる、Scala 3で作成',
      ],
    },
    page31 :{
      click0: [
        '組み合わせ可能な型制約ライブラリ',
      ],
      click1: [
        '組み合わせ可能な型制約ライブラリ',
      ],
    },
    page32 :{
      click0: [
        '正の数に制約する',
      ],
    },
    page33 :{
      click0: [
        '負の数ならコンパイラエラー',
      ],
    },
    page34 :{
      click0: [
        '合成可能な型制約を定義するライブラリ',
      ],
    },
    page35 :{
      click0: [
        '負の数ならコンパイラエラー',
      ],
    },
    page36 :{
      click0: [
        '42より大きい数字もコンパイラエラー',
      ],
    },
    page37 :{
      click0: [
        '検査',
      ],
    },
    page38 :{
      click0: [
        '',
      ],
      click1: [
        'コンパイル時に条件関数を評価できないため、値をリファインできません',
      ],
    },
    page39 :{
      click0: [
        'inline 化するか refineUnsafe を使って回避',
      ],
    },
    page40 :{
      click0: [
        'ルール違反する場合',
      ],
    },
    page41 :{
      click0: [
        'もし値が実行時にわかる場合',
      ],
    },
    page42 :{
      click0: [
        '制約付きOpaque Types',
      ],
    },
    page43 :{
      click0: [
        '制約の分解',
      ],
    },
    page44 :{
      click0: [
        '(1)可読性 (2)厳格な順序 (3)検証 (4)参照透過性 (5)性能 (6)簡潔さ (7)コンパイル時のチェック',
      ],
    },
    page45 :{
      click0: [
        '',
      ],
    },
    page46 :{
      click0: [
        'Cats と Zio の両方に対応',
      ],
    },
    page47 :{
      click0: [
        'その他諸々の型クラスにも対応',
      ],
    },
    page48 :{
      click0: [
        'ドメインモデル',
      ],
    },
    page49 :{
      click0: [
        'Tapirの例',
      ],
    },
    page50 :{
      click0: [
        'Doobieの例',
      ],
    },
    page51 :{
      click0: [
        'Integrationの書き方',
      ],
    },
    page52 :{
      click0: [
        'Doobieの例',
      ],
    },
    page53 :{
      click0: [
        '要点',
      ],
    },
    page54 :{
      click0: [
        '違法な状態を表現できないようにする',
      ],
      click1: [
        'フィードバック・ループを最小化',
      ],
      click2: [
        'コードの信頼性向上',
      ],
      click3: [
        'Scala 3の型システムは信じられないほど強力だ',
      ],
    },
    page55 :{
      click0: [
        'ご清聴ありがとうございました',
      ],
    },
  },
  en: {
    page1: {
      click0: [
      ],
    },
  },
}
const config = {
  noTTSDelay: 5000,
  ttsLangName: {
    jp_JP: 'Japanese',
    en: 'English'
  },
  background: 'transparent',
  color: '#ffffff',
  //fontSize: '36pt',
}
const subtitles = new Subtitles(contents, config)
</script>
<template>
  <footer >
    <img src="/images/ledger.svg" width="75" class="absolute bottom-5 left-8">
    <img src="/images/scala-matsuri.svg" width="50" class="absolute bottom-4 right-15">
    <slides-subtitle :subtitles="subtitles" />
  </footer>
</template>

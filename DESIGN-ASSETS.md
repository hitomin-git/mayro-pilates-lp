# Design assets and content provenance

確認日: 2026-09-17

## 公式写真・情報

- https://mayro-pilates.com/ : 公式ロゴ、スタジオ、マシン調整写真、アクセス。
- https://mayro-pilates.com/staff : Ayakaさんの実際の写真、Ayaka/Shoko両名の短いプロフィール。
- 予約リンク: https://mayro-pilates.com/reserve-1
- 写真: dist/assets/logo.svg / studio.jpg / lesson.jpg / ayaka.webp

## ユーザー提供の参考画像

- dist/assets/reference-design2.png: ユーザー提供の2枚目。724×2172px。
- 変更2の解剖図アイコン、理由アイコン、変化の小画像、スタジオのイメージ枠、最終バナーの一部は、この参考画像をSVGの表示範囲で切り出して表示。画像原本は変更していません。
- 参考画像中のMio/Rinaは公式スタッフとして転載していません。
- Shokoさんの写真を架空に作らず、名前のカードを配置しています。

## 生成写真

built-in imagegenを使用。いずれもイメージ写真で、実店舗や実スタッフを撮影したものではありません。

- dist/assets/hero.png: 前の版で作成したヒーロー。写真原本は変更せず使用。
- dist/assets/mayro-v2-concerns.jpg: 5つのお悩み用写真。生成PNGを同じ画素寸法のJPEGにエンコードして軽量化。
- dist/assets/mayro-v2-lesson.jpg: 4つのレッスン動作（2×2グリッド）。
- dist/assets/mayro-v2-trial.jpg: 予約・相談・体験・体験後の4場面（2×2グリッド）。
- JPEG3枚合計約681KB（元PNG合計約5.9MB）。写真はCSSの背景位置で各カードに表示。

## 変更2の生成プロンプト

Built-in image_gen; one request per asset, no retries.

CONCERNS
Use case: photorealistic-natural. Create one panoramic editorial fitness photography contact strip for a Japanese women's Pilates website. Exactly FIVE equal-width photo panels aligned left to right edge-to-edge, no gutters. Prefer 5:1 overall canvas (each panel square); if wide canvas limited use widest available landscape with five equal columns. In order: 1 adult Japanese woman in ivory T-shirt seated in side profile with gently rounded posture looking down, waist-up; 2 adult Japanese woman in modest T-shirt resting hand on shoulder, waist-up; 3 adult Japanese woman standing full body seen rear three-quarter wearing loose long-sleeve gym top and opaque workout pants, illustrating everyday posture, entire person visible; 4 adult Japanese woman seated touching lower back over ivory T-shirt, waist-up; 5 adult Japanese woman relaxed by bright window with thoughtful expression, waist-up. Refined candid lifestyle photography, softly lit white and warm ivory interiors, taupe clothes, low contrast natural daylight, pale beige backgrounds and gentle shadows. Each subject fully clothed in normal modest exercise clothing, anatomically natural. NO text, letters, numbers, marks, symbols, borders, gaps, watermarks, UI, website screenshot. Exactly five photographic scenes, no other panels.

LESSON
Use case: photorealistic-natural. Create one editorial Pilates photo asset composed of exactly FOUR photos in a precise edge-to-edge 2 by 2 grid. Canvas landscape 3:2 overall, each quadrant 3:2, equal widths and heights, NO gutters or margins. Top left: adult Japanese woman in modest taupe fitted T-shirt and opaque leggings side-lying on an exercise mat stretching gently; top right: adult Japanese woman in ivory exercise T-shirt and opaque taupe pants lying supine doing gentle Pilates abdominal curl, head and shoulders lifted; bottom left: adult Japanese woman in modest gym T-shirt and pants on hands and knees extending one leg in a stable gentle Pilates exercise; bottom right: adult Japanese woman seated upright on Pilates reformer extending one arm horizontally. Show sufficient full-body exercise context and natural anatomy. Premium airy white and warm ivory Pilates studio, softly blurred wood reformer equipment, natural daylight, quiet neutral beige and taupe tones, low contrast, natural authentic photography. Adult subjects fully clothed in normal modest exercise apparel. No text, numbers, symbols, borders, watermarks, UI or website screenshot. Exactly four scenes, one in each quadrant.

TRIAL
Use case: photorealistic-natural. Create one editorial fitness lifestyle photo asset composed of exactly FOUR photographs in a precise edge-to-edge 2 by 2 grid. Canvas landscape 3:2 overall, each quadrant 3:2, equal widths and heights, no gutters, no margins. Top left: close view of adult hands holding a smartphone with a blank neutral pale screen in bright softly blurred Pilates studio; top right: two adult Japanese women wearing modest normal ivory and taupe gym T-shirts seated facing one another discussing wellbeing, friendly expressions; bottom left: female Japanese instructor in modest gym apparel gently assisting adult Japanese woman with standing upright posture stretch, fully clothed both, supportive professional interaction, waist-up or full body; bottom right: two adult Japanese women in modest normal ivory and taupe gym apparel conversing and smiling warmly after class, waist-up. Airy premium white and ivory Pilates studio with subtle wooden equipment and a little greenery. Natural daylight, soft beige and taupe palette, low contrast, premium candid authentic editorial photography. All people adults, anatomically natural, fully clothed exercise apparel. No text, letters, numbers, symbols, borders, watermarks, UI or website screenshot. Phone screen must be blank without marks. Exactly four separate scenes in quadrant order.


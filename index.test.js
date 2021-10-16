const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('adds image-set if useAvif and useWebp options are present', async () => {
  await run(
    '.foo {background-image: url(\'img/logo.jpg\');}',
    '.foo {background-image: url(\'img/logo.jpg\');background-image: image-set(\'img/logo.avif\' type(\'image/avif\'),\'img/logo.webp\' type(\'image/webp\'),\'img/logo.jpg\' type(\'image/jpeg\'));}',
    {useAvif: true, useWebp: true})
})

it('adds image-set if useAvif and useWebp options are present (using absolute url)', async () => {
  await run(
    '.foo {background-image: url(\'https://example.org/img/logo.jpg\');}',
    '.foo {background-image: url(\'https://example.org/img/logo.jpg\');background-image: image-set(\'https://example.org/img/logo.avif\' type(\'image/avif\'),\'https://example.org/img/logo.webp\' type(\'image/webp\'),\'https://example.org/img/logo.jpg\' type(\'image/jpeg\'));}',
    {useAvif: true, useWebp: true})
})

it('adds image-set if useAvif and useWebp options are present (using relative url)', async () => {
  await run(
    '.foo {background-image: url(\'../img/logo.jpg\');}',
    '.foo {background-image: url(\'../img/logo.jpg\');background-image: image-set(\'../img/logo.avif\' type(\'image/avif\'),\'../img/logo.webp\' type(\'image/webp\'),\'../img/logo.jpg\' type(\'image/jpeg\'));}',
    {useAvif: true, useWebp: true})
})

it('adds image-set if useAvif options is present', async () => {
  await run(
    '.foo {background-image: url(\'img/logo.jpg\');}',
    '.foo {background-image: url(\'img/logo.jpg\');background-image: image-set(\'img/logo.avif\' type(\'image/avif\'),\'img/logo.jpg\' type(\'image/jpeg\'));}',
    {useAvif: true, useWebp: false})
})

it('adds image-set if useWebp options is present', async () => {
  await run(
    '.foo {background-image: url(\'img/logo.jpg\');}',
    '.foo {background-image: url(\'img/logo.jpg\');background-image: image-set(\'img/logo.webp\' type(\'image/webp\'),\'img/logo.jpg\' type(\'image/jpeg\'));}',
    {useAvif: false, useWebp: true})
})

it('does not add image-set if no option are present', async () => {
  await run(
    '.foo {background-image: url(\'img/logo.jpg\');}',
    '.foo {background-image: url(\'img/logo.jpg\');}',
    {useAvif: false, useWebp: false})
})

it('does not add image-set if background image is a base64 img', async () => {
  await run(
    '.foo {background-image: url(\'data:image/svg+xml;utf8,<svg ...> ... </svg>\');}',
    '.foo {background-image: url(\'data:image/svg+xml;utf8,<svg ...> ... </svg>\');}',
    {useAvif: true, useWebp: true})
})

it('does not add image-set if background image is a css variable', async () => {
  await run(
    '.foo {background-image: url(var(--path));}',
    '.foo {background-image: url(var(--path));}',
    {useAvif: true, useWebp: true})
})

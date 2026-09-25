import assert from 'assert';
import tex2svg, { tex, dvi2svg } from '../src';

async function main() {
  console.log('--- Running node-tikzjax test suite ---');

  // Test 1: ASCII
  console.log('Test 1: ASCII rendering');
  const svg1 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node {Hello World};\\end{tikzpicture}\\end{document}');
  assert(svg1.includes('Hello') && svg1.includes('orld'), 'Should contain Hello and orld');
  assert(!svg1.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 2: Chinese with punctuation
  console.log('Test 2: Chinese with punctuation');
  const svg2 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node[draw] {你好，世界！这是TikZ图表。};\\end{tikzpicture}\\end{document}');
  for (const char of '你好，世界！这是TikZ图表。') {
    assert(svg2.includes(char), `Should contain character '${char}'`);
  }
  assert(!svg2.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 3: Japanese
  console.log('Test 3: Japanese (Hiragana & Kanji)');
  const svg3 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node[draw] {こんにちは世界};\\end{tikzpicture}\\end{document}');
  for (const char of 'こんにちは世界') {
    assert(svg3.includes(char), `Should contain character '${char}'`);
  }
  assert(!svg3.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 4: Korean
  console.log('Test 4: Korean (Hangul)');
  const svg4 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node[draw] {안녕하세요 세계};\\end{tikzpicture}\\end{document}');
  for (const char of '안녕하세요 세계') {
    if (char !== ' ') {
      assert(svg4.includes(char), `Should contain character '${char}'`);
    }
  }
  assert(!svg4.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 5: Cyrillic
  console.log('Test 5: Cyrillic');
  const svg5 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node[draw] {Привет мир};\\end{tikzpicture}\\end{document}');
  for (const char of 'Привет мир') {
    if (char !== ' ') {
      assert(svg5.includes(char), `Should contain character '${char}'`);
    }
  }
  assert(!svg5.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 6: Greek and Math symbols
  console.log('Test 6: Greek & Math symbols (alpha, beta, le, gamma, rightarrow)');
  const svg6 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node {$\\alpha + \\beta \\le \\gamma \\rightarrow 1$};\\end{tikzpicture}\\end{document}');
  assert(!svg6.includes('TKZUNI'), 'Should not contain placeholders');
  assert(svg6.length > 100, 'Should generate valid SVG');
  console.log('  PASS');

  // Test 7: Degree symbol
  console.log('Test 7: Degree symbol (90°)');
  const svg7 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node {Angle: 90°};\\end{tikzpicture}\\end{document}');
  assert(!svg7.includes('TKZUNI'), 'Should not contain placeholders');
  assert(svg7.length > 100, 'Should generate valid SVG');
  console.log('  PASS');

  // Test 8: Emoji
  console.log('Test 8: Emoji');
  const svg8 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node {Smile 😊};\\end{tikzpicture}\\end{document}');
  assert(svg8.includes('😊'), 'Should contain emoji 😊');
  assert(!svg8.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  // Test 9: Custom unicodeMap
  console.log('Test 9: Custom unicodeMap option');
  const svg9 = await tex2svg('\\begin{document}\\begin{tikzpicture}\\node {♥};\\end{tikzpicture}\\end{document}', {
    unicodeMap: { '♥': '\\ensuremath{\\heartsuit}' },
  });
  assert(!svg9.includes('TKZUNI'), 'Should not contain placeholders');
  assert(svg9.length > 100, 'Should generate valid SVG');
  console.log('  PASS');

  // Test 10: Two-step API (tex then dvi2svg)
  console.log('Test 10: Two-step API (tex then dvi2svg)');
  const dvi = await tex('\\begin{document}\\begin{tikzpicture}\\node[draw] {两步渲染: $E=mc^2$};\\end{tikzpicture}\\end{document}');
  const svg10 = await dvi2svg(dvi);
  for (const char of '两步渲染') {
    assert(svg10.includes(char), `Should contain character '${char}'`);
  }
  assert(!svg10.includes('TKZUNI'), 'Should not contain placeholders');
  console.log('  PASS');

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

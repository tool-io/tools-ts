import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly textEncodedSrgb: readonly number[];
  readonly backgroundEncodedSrgb: readonly number[];
}>;
export type Output = Readonly<{ readonly approximateSignedApcaLc: number }>;
const inputFields = [
  { id: "textEncodedSrgb", label: "Text encoded srgb", kind: "numberList" },
  {
    id: "backgroundEncodedSrgb",
    label: "Background encoded srgb",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb3(input.textEncodedSrgb, "text");
  rgb3(input.backgroundEncodedSrgb, "background");
  const lum = (v: readonly number[]) =>
      v[0] ** 2.4 * 0.2126729 +
      v[1] ** 2.4 * 0.7151522 +
      v[2] ** 2.4 * 0.072175,
    clamp = (v: number) => (v < 0.022 ? v + (0.022 - v) ** 1.414 : v),
    t = clamp(lum(input.textEncodedSrgb)),
    b = clamp(lum(input.backgroundEncodedSrgb));
  if (Math.abs(t - b) < 0.0005) return { approximateSignedApcaLc: 0 };
  const s =
    b > t ? (b ** 0.56 - t ** 0.57) * 1.14 : (b ** 0.65 - t ** 0.62) * 1.14;
  return {
    approximateSignedApcaLc:
      b > t
        ? s < 0.1
          ? 0
          : (s - 0.027) * 100
        : s > -0.1
          ? 0
          : (s + 0.027) * 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  textEncodedSrgb: [0, 0, 0],
  backgroundEncodedSrgb: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  approximateSignedApcaLc: 106.04067321268862,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/apca-lc-contrast-approximation",
  title: "APCA Lc Contrast Approximation",
  description:
    "Opaque normalized encodeds RGBAPCA 0.0.98 G-style constant approximation (experimental Lcnot WCAG ratio), black clamp and polarity retained; not official certified APCA implementation or font-size conformance. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateSignedApcaLc",
      label: "Approximate signed apca lc",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      textEncodedSrgb: value.textEncodedSrgb as readonly number[],
      backgroundEncodedSrgb: value.backgroundEncodedSrgb as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

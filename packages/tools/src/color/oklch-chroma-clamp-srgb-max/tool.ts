import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  encode,
  hue,
  oklchRgb,
  inGamut,
  fraction,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly okLightnessFraction: number;
  readonly okHueDegrees: number;
  readonly requestedChroma: number;
}>;
export type Output = Readonly<{
  readonly clampedChroma: number;
  readonly clampedEncodedSrgb: readonly number[];
  readonly chromaReduced: boolean;
}>;
const inputFields = [
  { id: "okLightnessFraction", label: "Ok lightness fraction", kind: "number" },
  { id: "okHueDegrees", label: "Ok hue degrees", kind: "number" },
  { id: "requestedChroma", label: "Requested chroma", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.okLightnessFraction, "lightness");
  hue(input.okHueDegrees);
  if (input.requestedChroma < 0 || input.requestedChroma > 1)
    simpleError("chroma", "Requested bounded [0,1] chroma required.");
  if (input.okLightnessFraction === 0 || input.okLightnessFraction === 1)
    return {
      clampedChroma: 0,
      clampedEncodedSrgb: Array(3).fill(input.okLightnessFraction),
      chromaReduced: input.requestedChroma > 0,
    };
  let lo = 0,
    hi = input.requestedChroma,
    found = false;
  for (let i = 1; i <= 512; i++) {
    const c = (input.requestedChroma * i) / 512;
    if (
      !inGamut(
        oklchRgb(input.okLightnessFraction, c, input.okHueDegrees),
        1e-10,
      )
    ) {
      hi = c;
      found = true;
      break;
    }
    lo = c;
  }
  if (found)
    for (let i = 0; i < 48; i++) {
      const mid = (lo + hi) / 2;
      if (
        inGamut(
          oklchRgb(input.okLightnessFraction, mid, input.okHueDegrees),
          1e-10,
        )
      )
        lo = mid;
      else hi = mid;
    }
  const raw = oklchRgb(input.okLightnessFraction, lo, input.okHueDegrees);
  return {
    clampedChroma: lo,
    clampedEncodedSrgb: raw.map((v) => encode(Math.max(0, Math.min(1, v)))),
    chromaReduced: found,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  okLightnessFraction: 0,
  okHueDegrees: 0,
  requestedChroma: 0.2,
} satisfies Input;
export const exampleOutput = {
  clampedChroma: 0,
  clampedEncodedSrgb: [0, 0, 0],
  chromaReduced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/oklch-chroma-clamp-srgb-max",
  title: "OKLCH Chroma Clamp sRGB Max",
  description:
    "Search first radial sRGB-gamut boundary at fixed OKLCH L/h up to requested chroma using 512 scan steps and 48 bisections, preserving hue/lightness within matrix tolerance; numerical first-crossing clamp, not a global CSS gamut-map implementation or exact maximum over disconnected gamut intervals.",
  inputs: inputFields,
  outputs: [
    { id: "clampedChroma", label: "Clamped chroma", kind: "number" },
    {
      id: "clampedEncodedSrgb",
      label: "Clamped encoded srgb",
      kind: "numberList",
    },
    { id: "chromaReduced", label: "Chroma reduced", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      okLightnessFraction: value.okLightnessFraction as number,
      okHueDegrees: value.okHueDegrees as number,
      requestedChroma: value.requestedChroma as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb,
  decode,
  encode,
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly linearLightRetentionFraction: number;
  readonly shadowAlphaFraction: number;
}>;
export type Output = Readonly<{
  readonly shadowRgb: readonly number[];
  readonly shadowCss: string;
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  {
    id: "linearLightRetentionFraction",
    label: "Linear light retention fraction",
    kind: "number",
  },
  { id: "shadowAlphaFraction", label: "Shadow alpha fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.linearLightRetentionFraction, "linearLightRetentionFraction");
  fraction(input.shadowAlphaFraction, "shadowAlphaFraction");
  rgb(input.baseRgb);
  const c = input.baseRgb.map((v) =>
    encode(decode(v) * input.linearLightRetentionFraction),
  );
  return {
    shadowRgb: c,
    shadowCss: `rgb(${c.map((v) => Math.round(v * 255)).join(" ")} / ${input.shadowAlphaFraction})`,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  linearLightRetentionFraction: 0,
  shadowAlphaFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  shadowRgb: [0, 0, 0],
  shadowCss: "rgb(0 0 0 / 0.25)",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/shadow-color-derived-from-base-alpha",
  title: "Shadow Color Derived From Base Alpha",
  description:
    "Derive base-colored shadow by caller linear-light retention and separate alpha, outputting safe CSS; does not composite against unknown backdrop, multiply alpha twice or determine a visual depth/contrast guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "shadowRgb", label: "Shadow rgb", kind: "numberList" },
    { id: "shadowCss", label: "Shadow css", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      linearLightRetentionFraction:
        value.linearLightRetentionFraction as number,
      shadowAlphaFraction: value.shadowAlphaFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerSameSpaceLuminance: number;
  readonly sourceAlpha: number;
  readonly maskMode: string;
}>;
export type Output = Readonly<{ readonly conditionalMaskCoverage: number }>;
const inputFields = [
  {
    id: "callerSameSpaceLuminance",
    label: "Caller same space luminance",
    kind: "number",
  },
  { id: "sourceAlpha", label: "Source alpha", kind: "number" },
  { id: "maskMode", label: "Mask mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.callerSameSpaceLuminance, "callerSameSpaceLuminance");
  fraction(input.sourceAlpha, "sourceAlpha");
  return {
    conditionalMaskCoverage: pick(
      input.maskMode,
      {
        alpha: input.sourceAlpha,
        luminance: input.sourceAlpha * input.callerSameSpaceLuminance,
      },
      "mode",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSameSpaceLuminance: 0.8,
  sourceAlpha: 0.5,
  maskMode: "luminance",
} satisfies Input;
export const exampleOutput = { conditionalMaskCoverage: 0.4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/mask-image-alpha-vs-luminance-lookup",
  title: "mask-image Alpha vs Luminance Mode Lookup",
  description:
    "Mask alpha vs independently computed same-space luminance×alpha coverage, no hidden RGB transfer-function conversion or match-source inference. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalMaskCoverage",
      label: "Conditional mask coverage",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSameSpaceLuminance: value.callerSameSpaceLuminance as number,
      sourceAlpha: value.sourceAlpha as number,
      maskMode: value.maskMode as string,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIsolatedStrayComponentLuminance: number;
  readonly actualMatchedBrightReferenceLuminance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIsolatedStrayComponentLuminance",
    label: "Actual independently isolated stray component luminance",
    kind: "number",
  },
  {
    id: "actualMatchedBrightReferenceLuminance",
    label: "Actual matched bright reference luminance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyIsolatedStrayComponentLuminance,
    "actualIndependentlyIsolatedStrayComponentLuminance",
  );
  positive(
    input.actualMatchedBrightReferenceLuminance,
    "actualMatchedBrightReferenceLuminance",
  );
  return {
    value:
      (100 * input.actualIndependentlyIsolatedStrayComponentLuminance) /
      input.actualMatchedBrightReferenceLuminance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyIsolatedStrayComponentLuminance: 2,
    actualMatchedBrightReferenceLuminance: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/god-ray-intensity",
  title: "God Ray Intensity Calculator",
  description:
    "Observed god-ray independently isolated stray light luminance relative actual source percent, no infer lens scatter pattern or user perceived intensity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

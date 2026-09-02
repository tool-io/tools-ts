import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly apparentMagnitude: number;
  readonly distanceParsecs: number;
  readonly independentlyMeasuredBandExtinctionMagnitudes: number;
}>;
export type Output = Readonly<{ readonly absoluteMagnitude: number }>;
const inputFields = [
  { id: "apparentMagnitude", label: "Apparent magnitude", kind: "number" },
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
  {
    id: "independentlyMeasuredBandExtinctionMagnitudes",
    label: "Independently measured band extinction magnitudes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distanceParsecs, "distanceParsecs");
  nonnegative(
    input.independentlyMeasuredBandExtinctionMagnitudes,
    "independentlyMeasuredBandExtinctionMagnitudes",
  );
  return {
    absoluteMagnitude:
      input.apparentMagnitude -
      5 * Math.log10(input.distanceParsecs) +
      5 -
      input.independentlyMeasuredBandExtinctionMagnitudes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apparentMagnitude: 12,
  distanceParsecs: 100,
  independentlyMeasuredBandExtinctionMagnitudes: 2,
} satisfies Input;
export const exampleOutput = { absoluteMagnitude: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/apparent-to-absolute-magnitude",
  title: "Apparent to Absolute Magnitude Converter",
  description:
    "Extinction-corrected absolute magnitude in same passband, independent measured extinction not inferred from distance. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "absoluteMagnitude", label: "Absolute magnitude", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      apparentMagnitude: value.apparentMagnitude as number,
      distanceParsecs: value.distanceParsecs as number,
      independentlyMeasuredBandExtinctionMagnitudes:
        value.independentlyMeasuredBandExtinctionMagnitudes as number,
    }),
});
export const run = tool.execute;
export default tool;

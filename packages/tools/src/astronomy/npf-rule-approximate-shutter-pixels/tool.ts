import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, rad } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly fNumber: number;
  readonly pixelPitchMicrometers: number;
  readonly focalMm: number;
  readonly declinationDegrees: number;
}>;
export type Output = Readonly<{ readonly approximateNpfSeconds: number }>;
const inputFields = [
  { id: "fNumber", label: "F number", kind: "number" },
  {
    id: "pixelPitchMicrometers",
    label: "Pixel pitch micrometers",
    kind: "number",
  },
  { id: "focalMm", label: "Focal mm", kind: "number" },
  { id: "declinationDegrees", label: "Declination degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fNumber, "fNumber");
  positive(input.pixelPitchMicrometers, "pixelPitchMicrometers");
  positive(input.focalMm, "focalMm");
  if (Math.abs(input.declinationDegrees) > 80)
    simpleError("declination", "Bounded nonpolar|declination|≤80°.");
  return {
    approximateNpfSeconds:
      (35 * input.fNumber + 30 * input.pixelPitchMicrometers) /
      (input.focalMm * Math.cos(rad(input.declinationDegrees))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fNumber: 2,
  pixelPitchMicrometers: 4,
  focalMm: 50,
  declinationDegrees: 0,
} satisfies Input;
export const exampleOutput = { approximateNpfSeconds: 3.8 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/npf-rule-approximate-shutter-pixels",
  title: "NPF Rule Approximate Shutter Pixels",
  description:
    "Named simplified NPF(35 N+30 p)/(fcosδ) heuristic, bounded|δ|≤80°; no polar infinity, seeing/demosaicing/sharpness guarantee. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateNpfSeconds",
      label: "Approximate npf seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fNumber: value.fNumber as number,
      pixelPitchMicrometers: value.pixelPitchMicrometers as number,
      focalMm: value.focalMm as number,
      declinationDegrees: value.declinationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

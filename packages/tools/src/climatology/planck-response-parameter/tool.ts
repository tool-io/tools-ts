import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly effectiveRadiatingKelvin: number;
  readonly callerEffectiveEmissivity: number;
}>;
export type Output = Readonly<{ readonly idealPlanckRestoringWPerM2K: number }>;
const inputFields = [
  {
    id: "effectiveRadiatingKelvin",
    label: "Effective radiating kelvin",
    kind: "number",
  },
  {
    id: "callerEffectiveEmissivity",
    label: "Caller effective emissivity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.effectiveRadiatingKelvin, "effectiveRadiatingKelvin");
  fraction(input.callerEffectiveEmissivity, "callerEffectiveEmissivity");
  return {
    idealPlanckRestoringWPerM2K:
      4 *
      input.callerEffectiveEmissivity *
      5.670374419e-8 *
      input.effectiveRadiatingKelvin ** 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  effectiveRadiatingKelvin: 255,
  callerEffectiveEmissivity: 1,
} satisfies Input;
export const exampleOutput = {
  idealPlanckRestoringWPerM2K: 3.7609041852738447,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/planck-response-parameter",
  title: "Planck Response Parameter Calculator",
  description:
    "Derivative of ideal emissiveεσT⁴flux positive outgoing/restoring convention, not actual global Planck feedback spatial weighting. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealPlanckRestoringWPerM2K",
      label: "Ideal planck restoring w per m2 k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      effectiveRadiatingKelvin: value.effectiveRadiatingKelvin as number,
      callerEffectiveEmissivity: value.callerEffectiveEmissivity as number,
    }),
});
export const run = tool.execute;
export default tool;

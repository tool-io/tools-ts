import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualUrinaryExcretionMassPerTime: number;
  readonly matchedPlasmaConcentrationMassPerVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUrinaryExcretionMassPerTime",
    label: "Actual urinary excretion mass per time",
    kind: "number",
  },
  {
    id: "matchedPlasmaConcentrationMassPerVolume",
    label: "Matched plasma concentration mass per volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualUrinaryExcretionMassPerTime, "numerator");
  positive(input.matchedPlasmaConcentrationMassPerVolume, "denominator");
  return {
    observedRatio:
      (1 * input.actualUrinaryExcretionMassPerTime) /
      input.matchedPlasmaConcentrationMassPerVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUrinaryExcretionMassPerTime: 2,
    matchedPlasmaConcentrationMassPerVolume: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/renal-clearance",
  title: "Renal Clearance Calculator",
  description:
    "Actual urinary mass-excretion/plasma concentration renal clearance, not GFRor tubular-only clearance. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

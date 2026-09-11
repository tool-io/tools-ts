import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRemovedSubstanceMassPerTime: number;
  readonly matchedPlasmaSubstanceMassPerVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRemovedSubstanceMassPerTime",
    label: "Actual removed substance mass per time",
    kind: "number",
  },
  {
    id: "matchedPlasmaSubstanceMassPerVolume",
    label: "Matched plasma substance mass per volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualRemovedSubstanceMassPerTime, "numerator");
  positive(input.matchedPlasmaSubstanceMassPerVolume, "denominator");
  return {
    observedRatio:
      (1 * input.actualRemovedSubstanceMassPerTime) /
      input.matchedPlasmaSubstanceMassPerVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRemovedSubstanceMassPerTime: 2,
    matchedPlasmaSubstanceMassPerVolume: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/clearance",
  title: "Clearance Calculator",
  description:
    "Observed actual clearance volume/time from independently attributed removal mass flux/plasma concentration. Not renal GFR, hepatic extraction model or clinical dose instruction. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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

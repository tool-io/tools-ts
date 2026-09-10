import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentFreshAirVolumeFlowCubicMetersPerHour: number;
  readonly actualIndependentlyMappedCaveAirVolumeCubicMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentFreshAirVolumeFlowCubicMetersPerHour",
    label: "Actual independent fresh air volume flow cubic meters per hour",
    kind: "number",
  },
  {
    id: "actualIndependentlyMappedCaveAirVolumeCubicMeters",
    label: "Actual independently mapped cave air volume cubic meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentFreshAirVolumeFlowCubicMetersPerHour,
    "numerator",
  );
  positive(
    input.actualIndependentlyMappedCaveAirVolumeCubicMeters,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualIndependentFreshAirVolumeFlowCubicMetersPerHour) /
      input.actualIndependentlyMappedCaveAirVolumeCubicMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentFreshAirVolumeFlowCubicMetersPerHour: 2,
    actualIndependentlyMappedCaveAirVolumeCubicMeters: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/air-exchange-rate",
  title: "Cave Air Exchange Rate Calculator",
  description:
    "Actual fresh-air flow/caveairvolume nominal exchanges/hour, mixing and stagnant zones external; not safe atmosphere approval. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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

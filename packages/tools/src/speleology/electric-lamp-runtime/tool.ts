import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyMeasuredUsableLampBatteryEnergyWh: number;
  readonly actualMatchedMeanLampPowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyMeasuredUsableLampBatteryEnergyWh",
    label: "Caller independently measured usable lamp battery energy wh",
    kind: "number",
  },
  {
    id: "actualMatchedMeanLampPowerWatts",
    label: "Actual matched mean lamp power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyMeasuredUsableLampBatteryEnergyWh,
    "numerator",
  );
  positive(input.actualMatchedMeanLampPowerWatts, "denominator");
  return {
    observedRatio:
      (1 * input.callerIndependentlyMeasuredUsableLampBatteryEnergyWh) /
      input.actualMatchedMeanLampPowerWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyMeasuredUsableLampBatteryEnergyWh: 2,
    actualMatchedMeanLampPowerWatts: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/electric-lamp-runtime",
  title: "Electric Lamp Battery Runtime Calculator",
  description:
    "Conditional actual usable battery energy/meanlamp power runtime. Battery/output/temperature conditions independently matched; not nameplate capacity or guaranteed backup duration. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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

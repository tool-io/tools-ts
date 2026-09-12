import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSteamMassFlowKgPerSecond: number;
  readonly callerMatchedSteamSpecificVolumeCubicMetersPerKg: number;
  readonly actualPipeInnerAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSteamMassFlowKgPerSecond",
    label: "Actual steam mass flow kg per second",
    kind: "number",
  },
  {
    id: "callerMatchedSteamSpecificVolumeCubicMetersPerKg",
    label: "Caller matched steam specific volume cubic meters per kg",
    kind: "number",
  },
  {
    id: "actualPipeInnerAreaSquareMeters",
    label: "Actual pipe inner area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualSteamMassFlowKgPerSecond,
    "actualSteamMassFlowKgPerSecond",
  );
  positive(
    input.callerMatchedSteamSpecificVolumeCubicMetersPerKg,
    "callerMatchedSteamSpecificVolumeCubicMetersPerKg",
  );
  positive(
    input.actualPipeInnerAreaSquareMeters,
    "actualPipeInnerAreaSquareMeters",
  );
  return {
    value:
      (input.actualSteamMassFlowKgPerSecond *
        input.callerMatchedSteamSpecificVolumeCubicMetersPerKg) /
      input.actualPipeInnerAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSteamMassFlowKgPerSecond: 2,
    callerMatchedSteamSpecificVolumeCubicMetersPerKg: 5,
    actualPipeInnerAreaSquareMeters: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-velocity",
  title: "Plumbing Steam Velocity Calculator",
  description:
    "Actual steam mass flow\u00d7independently matched specific volume/actual area, compressible state externally verified, no water-volume assumption. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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

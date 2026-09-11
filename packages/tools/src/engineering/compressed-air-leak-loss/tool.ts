import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualLeakFreeAirVolumePerHour: number;
  readonly callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume: number;
  readonly actualObservedHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLeakFreeAirVolumePerHour",
    label: "Actual leak free air volume per hour",
    kind: "number",
  },
  {
    id: "callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume",
    label: "Caller verified compressor specific energy wh per free air volume",
    kind: "number",
  },
  { id: "actualObservedHours", label: "Actual observed hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualLeakFreeAirVolumePerHour,
    "actualLeakFreeAirVolumePerHour",
  );
  nonnegative(
    input.callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume,
    "callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume",
  );
  nonnegative(input.actualObservedHours, "actualObservedHours");
  return {
    value:
      input.actualLeakFreeAirVolumePerHour *
      input.callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume *
      input.actualObservedHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLeakFreeAirVolumePerHour: 2,
    callerVerifiedCompressorSpecificEnergyWhPerFreeAirVolume: 3,
    actualObservedHours: 10,
  },
  output: { result: { value: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/compressed-air-leak-loss",
  title: "Compressed Air Leak Loss Calculator",
  description:
    "Actual independently observed free air leak\u00d7specific compressor energy\u00d7duration wasted Wh, not infer leak rate/nozzle flow or safe pressure test. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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

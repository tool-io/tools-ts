import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualStationElevationsRelativeToDatumMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStationElevationsRelativeToDatumMeters",
    label: "Actual station elevations relative to datum meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualStationElevationsRelativeToDatumMeters.length)
    simpleError("stations", "Actual nonempty common-datumstations.");
  return {
    observedVerticalReliefMeters:
      Math.max(...input.actualStationElevationsRelativeToDatumMeters) -
      Math.min(...input.actualStationElevationsRelativeToDatumMeters),
    observedMinimumStationElevationMeters: Math.min(
      ...input.actualStationElevationsRelativeToDatumMeters,
    ),
    observedMaximumStationElevationMeters: Math.max(
      ...input.actualStationElevationsRelativeToDatumMeters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualStationElevationsRelativeToDatumMeters: [10, 5, -2] },
  output: {
    result: {
      observedVerticalReliefMeters: 12,
      observedMinimumStationElevationMeters: -2,
      observedMaximumStationElevationMeters: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/cave-depth-chain-total",
  title: "Cave Depth Total from Station Chain Calculator",
  description:
    "Actual independently surveyed station vertical range, not total absolute ascent/descent or entrance-relative maximum depth. Common datum and coverage external.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualObservedElectricalInputPowerWatts: number;
  readonly actualObservedExportedOpticalMechanicalPowerWatts: number;
  readonly actualObservedStoredEnergyRateWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedElectricalInputPowerWatts",
    label: "Actual observed electrical input power watts",
    kind: "number",
  },
  {
    id: "actualObservedExportedOpticalMechanicalPowerWatts",
    label: "Actual observed exported optical mechanical power watts",
    kind: "number",
  },
  {
    id: "actualObservedStoredEnergyRateWatts",
    label: "Actual observed stored energy rate watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualObservedElectricalInputPowerWatts,
    "actualObservedElectricalInputPowerWatts",
  );
  nonnegative(
    input.actualObservedExportedOpticalMechanicalPowerWatts,
    "actualObservedExportedOpticalMechanicalPowerWatts",
  );
  return {
    value:
      input.actualObservedElectricalInputPowerWatts -
      input.actualObservedExportedOpticalMechanicalPowerWatts -
      input.actualObservedStoredEnergyRateWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedElectricalInputPowerWatts: 10,
    actualObservedExportedOpticalMechanicalPowerWatts: 2,
    actualObservedStoredEnergyRateWatts: 2,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/heat-dissipation-headset",
  title: "Headset Heat Dissipation Calculator",
  description:
    "Actual signed thermal power energy balance input\u2212export\u2212storage, not temperature prediction, convect ion coefficient or guarantee safe headset heat.",
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

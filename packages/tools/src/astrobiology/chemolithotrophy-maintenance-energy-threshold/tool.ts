import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedUsablePowerWatts: number;
  readonly callerValidatedMaintenanceWattsPerCell: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedUsablePowerWatts",
    label: "Caller calibrated usable power watts",
    kind: "number",
  },
  {
    id: "callerValidatedMaintenanceWattsPerCell",
    label: "Caller validated maintenance watts per cell",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerCalibratedUsablePowerWatts, "power");
  positive(input.callerValidatedMaintenanceWattsPerCell, "maintenance");
  return {
    conditionalWholeCellMaintenanceCapacity: Math.floor(
      input.callerCalibratedUsablePowerWatts /
        input.callerValidatedMaintenanceWattsPerCell,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedUsablePowerWatts: 10,
    callerValidatedMaintenanceWattsPerCell: 2,
  },
  output: { result: { conditionalWholeCellMaintenanceCapacity: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/chemolithotrophy-maintenance-energy-threshold",
  title: "Chemolithotrophy Minimum Maintenance Energy Threshold Calculator",
  description:
    "Conditional whole-cell steady maintenance energy budget under independently calibrated organism/state-specific requirements. Not actual biomass, viability, growth or a universal minimum-power threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

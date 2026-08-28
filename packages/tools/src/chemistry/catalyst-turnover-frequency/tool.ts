import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const catalystTurnoverFrequencyExample = {
  input: { catalystMoles: 0.00001, productMolesPerSecond: 0.002 },
} satisfies ToolExample<{
  readonly catalystMoles: number;
  readonly productMolesPerSecond: number;
}>;

export const catalystTurnoverFrequencyTool = createSimpleTool({
  id: "chemistry/catalyst-turnover-frequency",
  title: "Turnover Frequency",
  description:
    "Compute the catalyst turnover frequency as moles of product formed per second per mole of catalyst.",
  inputs: [
    {
      id: "productMolesPerSecond",
      label: "Product formation rate",
      kind: "number",
      unit: "mol/s",
    },
    {
      id: "catalystMoles",
      label: "Catalyst amount",
      kind: "number",
      unit: "mol",
    },
  ],
  outputs: [
    {
      id: "turnoverFrequencyPerS",
      label: "Turnover frequency",
      kind: "number",
      unit: "1/s",
    },
  ],
  calculate: (input) => {
    const productMolesPerSecond = input.productMolesPerSecond as number;
    const catalystMoles = input.catalystMoles as number;
    if (!(productMolesPerSecond > 0))
      simpleError(
        "productMolesPerSecond",
        "Product formation rate must be positive.",
      );
    if (!(catalystMoles > 0))
      simpleError("catalystMoles", "Catalyst amount must be positive.");
    return {
      turnoverFrequencyPerS: productMolesPerSecond / catalystMoles,
    };
  },
});
export const runCatalystTurnoverFrequency =
  catalystTurnoverFrequencyTool.execute;
export default catalystTurnoverFrequencyTool;

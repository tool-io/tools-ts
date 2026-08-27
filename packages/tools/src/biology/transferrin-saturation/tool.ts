import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransferrinSaturationInput = {
  readonly serumIronUgdL: number;
  readonly transferrinCapacityUgdL: number;
};

export type TransferrinSaturationOutput = {
  readonly transferrinSaturationPercent: number;
};

export const transferrinSaturationExample = {
  input: { serumIronUgdL: 80, transferrinCapacityUgdL: 300 },
  output: { transferrinSaturationPercent: 26.666666666666668 },
} satisfies ToolExample<
  TransferrinSaturationInput,
  TransferrinSaturationOutput
>;

export const transferrinSaturationTool = createSimpleTool({
  id: "biology/transferrin-saturation",
  title: "Transferrin Saturation %",
  description:
    "Compute transferrin saturation as serum iron divided by total iron binding capacity times one hundred.",
  inputs: [
    {
      id: "serumIronUgdL",
      label: "Serum iron",
      kind: "number",
      unit: "µg/dL",
    },
    {
      id: "transferrinCapacityUgdL",
      label: "Transferrin capacity",
      kind: "number",
      unit: "µg/dL",
    },
  ],
  outputs: [
    {
      id: "transferrinSaturationPercent",
      label: "Transferrin saturation",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const transferrinCapacityUgdL = input.transferrinCapacityUgdL as number;
    const serumIronUgdL = input.serumIronUgdL as number;
    if (transferrinCapacityUgdL <= 0)
      simpleError(
        "transferrinCapacityUgdL",
        "The transferrin capacity must be greater than zero.",
        "invalid_capacity",
      );
    if (serumIronUgdL < 0 || serumIronUgdL > transferrinCapacityUgdL)
      simpleError(
        "serumIronUgdL",
        "The serum iron must lie between zero and the transferrin capacity.",
        "invalid_iron_values",
      );
    return {
      transferrinSaturationPercent:
        (serumIronUgdL / transferrinCapacityUgdL) * 100,
    };
  },
});
export const runTransferrinSaturation = transferrinSaturationTool.execute;
export default transferrinSaturationTool;

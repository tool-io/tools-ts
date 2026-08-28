import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerVoltageRatioInput = {
  readonly primaryTurns: number;
  readonly primaryVolts: number;
  readonly secondaryTurns: number;
};

export type TransformerVoltageRatioOutput = {
  readonly secondaryVolts: number;
};

export const transformerVoltageRatioExample = {
  input: { primaryTurns: 500, primaryVolts: 120, secondaryTurns: 100 },
  output: { secondaryVolts: 24 },
} satisfies ToolExample<
  TransformerVoltageRatioInput,
  TransformerVoltageRatioOutput
>;

export const transformerVoltageRatioTool = createSimpleTool({
  calculate: (input) => {
    const { primaryTurns, primaryVolts, secondaryTurns } =
      input as unknown as TransformerVoltageRatioInput;
    if (primaryVolts <= 0)
      simpleError(
        "primaryVolts",
        "Primary voltage must be positive.",
        "degenerate_input",
      );
    if (primaryTurns < 1)
      simpleError(
        "primaryTurns",
        "Primary turns must be at least 1.",
        "degenerate_input",
      );
    if (secondaryTurns < 1)
      simpleError(
        "secondaryTurns",
        "Secondary turns must be at least 1.",
        "degenerate_input",
      );
    return {
      secondaryVolts: (primaryVolts * secondaryTurns) / primaryTurns,
    };
  },
  description:
    "Compute the transformer secondary voltage from the primary voltage and winding turns.",
  id: "electronics/transformer-voltage-ratio",
  inputs: [
    { id: "primaryVolts", kind: "number", label: "Primary voltage", unit: "V" },
    { id: "primaryTurns", kind: "integer", label: "Primary turns" },
    { id: "secondaryTurns", kind: "integer", label: "Secondary turns" },
  ],
  outputs: [
    {
      id: "secondaryVolts",
      kind: "number",
      label: "Secondary voltage",
      unit: "V",
    },
  ],
  title: "Voltage Ratio",
});
export const runTransformerVoltageRatio = transformerVoltageRatioTool.execute;
export default transformerVoltageRatioTool;

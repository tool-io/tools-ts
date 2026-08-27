import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const serialDilutionBiologyExample = {
  input: { dilutionSteps: 3, startConcentration: 100, transferRatio: 0.5 },
  output: { finalConcentration: 12.5 },
} satisfies ToolExample<
  {
    readonly dilutionSteps: number;
    readonly startConcentration: number;
    readonly transferRatio: number;
  },
  { readonly finalConcentration: number }
>;

export const serialDilutionBiologyTool = createSimpleTool({
  id: "biology/serial-dilution-biology",
  title: "Serial Dilution Biology",
  description:
    "Compute the endpoint concentration of a serial dilution: finalConcentration = startConcentration x transferRatio^steps, with a strictly fractional transfer ratio and at least one step.",
  inputs: [
    {
      description: "Starting concentration; must be greater than zero.",
      id: "startConcentration",
      label: "Start concentration",
      kind: "number",
    },
    {
      description: "Transfer ratio per step, strictly between 0 and 1.",
      id: "transferRatio",
      label: "Transfer ratio",
      kind: "number",
    },
    {
      description: "Number of dilution steps; integer of at least 1.",
      id: "dilutionSteps",
      label: "Dilution steps",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Final concentration after all steps.",
      id: "finalConcentration",
      label: "Final concentration",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const startConcentration = input.startConcentration as number;
    const transferRatio = input.transferRatio as number;
    const dilutionSteps = input.dilutionSteps as number;
    if (!(startConcentration > 0))
      simpleError(
        "startConcentration",
        "The start concentration must be greater than zero.",
      );
    if (!(transferRatio > 0 && transferRatio < 1))
      simpleError(
        "transferRatio",
        "The transfer ratio must lie strictly between 0 and 1.",
      );
    return {
      finalConcentration:
        startConcentration * Math.pow(transferRatio, dilutionSteps),
    };
  },
});
export const runSerialDilutionBiology = serialDilutionBiologyTool.execute;
export default serialDilutionBiologyTool;

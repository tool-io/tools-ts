import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SerialDilutionInput = {
  readonly dilutionFactor?: number;
  readonly initialConcentration: number;
  readonly transferCount: number;
};

export type SerialDilutionOutput = {
  readonly finalConcentration: number;
};

export const serialDilutionExample = {
  input: { initialConcentration: 0.8, dilutionFactor: 0.5, transferCount: 2 },
  output: { finalConcentration: 0.8 * 0.5 ** 2 },
} satisfies ToolExample<SerialDilutionInput, SerialDilutionOutput>;

export const serialDilutionTool = createSimpleTool({
  id: "chemistry/serial-dilution",
  title: "Serial Dilution Calculator",
  description:
    "Compute the final concentration after a series of identical dilution transfers.",
  inputs: [
    {
      description: "Concentration of the starting solution.",
      id: "initialConcentration",
      kind: "number",
      label: "Initial concentration",
      unit: "mol/L",
    },
    {
      description:
        "Fraction of the previous concentration kept at each transfer; strictly between zero and one.",
      default: 0.1,
      id: "dilutionFactor",
      kind: "number",
      label: "Dilution factor",
    },
    {
      description: "Number of successive transfer steps.",
      id: "transferCount",
      kind: "integer",
      label: "Transfer count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Concentration after all transfers.",
      id: "finalConcentration",
      kind: "number",
      label: "Final concentration",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const initialConcentration = input.initialConcentration as number;
    if (!(initialConcentration > 0))
      simpleError(
        "initialConcentration",
        "The initial concentration must be greater than zero.",
      );
    const dilutionFactor = input.dilutionFactor as number;
    if (!(dilutionFactor > 0) || dilutionFactor >= 1)
      simpleError(
        "dilutionFactor",
        "The dilution factor must be strictly between zero and one.",
        "invalid_factor",
      );
    const transferCount = input.transferCount as number;
    return {
      finalConcentration:
        initialConcentration * dilutionFactor ** transferCount,
    };
  },
});
export const runSerialDilution = serialDilutionTool.execute;
export default serialDilutionTool;

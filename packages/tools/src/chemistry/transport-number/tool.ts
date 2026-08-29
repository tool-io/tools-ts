import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const TransportNumberTool = createSimpleTool({
  id: "chemistry/transport-number",
  title: "Transport Number Calculator",
  description: "Compute cation transport number fraction.",
  inputs: [
    { id: "cationConductivity", label: "Lambda+", kind: "number", minimum: 0 },
    { id: "anionConductivity", label: "Lambda-", kind: "number", minimum: 0 },
  ],
  outputs: [
    { id: "transportNumber", label: "Transport number", kind: "number" },
  ],
  calculate: (input) => {
    const total =
      (input.cationConductivity as number) +
      (input.anionConductivity as number);
    if (total === 0)
      simpleError("cationConductivity", ">0 required.", "invalid_total");
    return { transportNumber: (input.cationConductivity as number) / total };
  },
});
export default TransportNumberTool;
export const runTransportNumber = TransportNumberTool.execute;

export type TransportNumberInput = {
  readonly cationConductivity: number;
  readonly anionConductivity: number;
};

export type TransportNumberOutput = {
  readonly transportNumber: number;
};

export const transportNumberExample = {
  input: {
    cationConductivity: 1,
    anionConductivity: 1,
  },
  output: {
    transportNumber: 0.5,
  },
} satisfies ToolExample<TransportNumberInput, TransportNumberOutput>;

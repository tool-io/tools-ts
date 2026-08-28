import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const CpMinusCvTool = createSimpleTool({
  id: "chemistry/cp-minus-cv",
  title: "Cp Minus Cv Calculator",
  description: "Return the ideal gas Cp-Cv difference which equals R.",
  inputs: [],
  outputs: [
    { id: "cpMinusCv", label: "Cp-Cv", kind: "number", unit: "J/(mol*K)" },
  ],
  calculate: (input) => {
    return { cpMinusCv: 8.314 };
  },
});
export default CpMinusCvTool;
export const runCpMinusCv = CpMinusCvTool.execute;

export type CpMinusCvInput = {};

export type CpMinusCvOutput = {
  readonly cpMinusCv: number;
};

export const cpMinusCvExample = {
  input: {},
  output: {
    cpMinusCv: 8.314,
  },
} satisfies ToolExample<CpMinusCvInput, CpMinusCvOutput>;

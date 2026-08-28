import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const reducedPressureTool = createSimpleTool({
  id: "chemistry/reduced-pressure",
  title: "Reduced Pressure Calculator",
  description: "Compute dimensionless Pr = P/Pc.",
  inputs: [
    { id: "pressure", label: "Pressure", kind: "number", minimum: 0 },
    { id: "criticalPressure", label: "Pc", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "reducedPressure", label: "Pr", kind: "number" }],
  calculate: (input) => {
    const pc = input.criticalPressure as number;
    if (pc <= 0) simpleError("criticalPressure", ">0 required.", "invalid_pc");
    return { reducedPressure: (input.pressure as number) / pc };
  },
});
export const runReducedPressure = reducedPressureTool.execute;
export default reducedPressureTool;

export type ReducedPressureInput = {
  readonly pressure: number;
  readonly criticalPressure: number;
};

export type ReducedPressureOutput = {
  readonly reducedPressure: number;
};

export const reducedPressureExample = {
  input: {
    pressure: 1,
    criticalPressure: 1,
  },
  output: {
    reducedPressure: 1,
  },
} satisfies ToolExample<ReducedPressureInput, ReducedPressureOutput>;

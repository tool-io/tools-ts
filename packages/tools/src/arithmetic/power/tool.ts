import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const powerExample = {
  input: { base: 2, exponent: -3 },
} satisfies ToolExample<{
  readonly base: number;
  readonly exponent: number;
}>;

export const powerTool = createSimpleTool({
  id: "arithmetic/power",
  title: "Power Calculator",
  description: "Raise a finite base to a finite exponent.",
  inputs: [
    { id: "base", label: "Base", kind: "number" },
    { id: "exponent", label: "Exponent", kind: "number" },
  ],
  outputs: [{ id: "power", label: "Power", kind: "number" }],
  calculate: (input) => {
    const power = (input.base as number) ** (input.exponent as number);
    if (!Number.isFinite(power))
      simpleError(
        "exponent",
        "The base and exponent do not produce a finite real number.",
      );
    return { power };
  },
});

export const runPower = powerTool.execute;
export default powerTool;

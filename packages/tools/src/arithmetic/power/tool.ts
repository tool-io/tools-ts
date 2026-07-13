import { createSimpleTool, simpleError } from "../../core/simple.js";

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

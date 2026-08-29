import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { modularPower } from "../milestone-algorithms.js";

export const example = {
  input: {
    base: 4,
    exponent: 13,
    modulus: 497,
  },
  output: {
    remainder: 445,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tool = createSimpleTool({
  id: "number/modular-exponentiation",
  title: "Modular Exponentiation Calculator",
  description:
    "Compute base^exponent modulo a positive integer using repeated squaring and BigInt intermediates; handles negative bases without floating-point overflow.",
  inputs: [
    { id: "base", kind: "integer", label: "base" },
    { id: "exponent", kind: "integer", label: "exponent", minimum: 0 },
    { id: "modulus", kind: "integer", label: "modulus", minimum: 1 },
  ],
  outputs: [{ id: "remainder", kind: "integer", label: "remainder" }],
  calculate: (input) => ({
    remainder: modularPower(
      input.base as number,
      input.exponent as number,
      input.modulus as number,
    ),
  }),
});
export type ModularExponentiationInput = Readonly<typeof example.input>;
export type ModularExponentiationOutput = Readonly<typeof example.output>;
export const modularExponentiationTool = tool;
export const runModularExponentiation = tool.execute;
export default tool;

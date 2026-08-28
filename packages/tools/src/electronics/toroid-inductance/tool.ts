import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ToroidInductanceInput = {
  readonly alNhPerTurnSq: number;
  readonly turnsInt: number;
};

export type ToroidInductanceOutput = {
  readonly inductanceUh: number;
};

export const toroidInductanceExample = {
  input: { alNhPerTurnSq: 1000, turnsInt: 10 },
  output: { inductanceUh: 100 },
} satisfies ToolExample<ToroidInductanceInput, ToroidInductanceOutput>;

export const toroidInductanceTool = createSimpleTool({
  calculate: (input) => {
    const alNhPerTurnSq = input.alNhPerTurnSq as number;
    const turnsInt = input.turnsInt as number;
    if (!(alNhPerTurnSq > 0))
      simpleError("alNhPerTurnSq", "AL value must be positive.", "invalid_al");
    return {
      inductanceUh: (alNhPerTurnSq * turnsInt ** 2) / 1000,
    };
  },
  description:
    "Compute toroid inductance in microhenries as AL (nH per turn squared) times the square of the turns divided by 1000.",
  id: "electronics/toroid-inductance",
  inputs: [
    {
      default: 1000,
      id: "alNhPerTurnSq",
      kind: "number",
      label: "AL value",
      unit: "nH/turn^2",
    },
    { id: "turnsInt", kind: "integer", label: "Turns", minimum: 1 },
  ],
  outputs: [
    { id: "inductanceUh", kind: "number", label: "Inductance", unit: "uH" },
  ],
  title: "Toroid Inductance",
});
export const runToroidInductance = toroidInductanceTool.execute;
export default toroidInductanceTool;

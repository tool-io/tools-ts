import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const modularComplementExample = {
  input: { modulus: 10, value: 3 },
  output: { complement: 7 },
} satisfies ToolExample<ModularComplementInput, ModularComplementOutput>;

type ModularComplementInput = {
  readonly modulus: number;
  readonly value: number;
};
type ModularComplementOutput = { readonly complement: number };

export const calculateModularComplement = (
  input: ModularComplementInput,
): ModularComplementOutput => {
  if (input.modulus <= 0)
    simpleError("modulus", "The modulus must be positive.", "invalid_modulus");
  return {
    complement: (input.modulus - (input.value % input.modulus)) % input.modulus,
  };
};

export const modularComplementTool = createSimpleTool({
  calculate: (input) =>
    calculateModularComplement(input as unknown as ModularComplementInput),
  description:
    "Compute the modular complement: the additive inverse modulo a given modulus.",
  id: "arithmetic/modular-complement",
  inputs: [
    { id: "modulus", kind: "integer", label: "Modulus", minimum: 1 },
    { id: "value", kind: "integer", label: "Value", minimum: 0 },
  ],
  outputs: [{ id: "complement", kind: "integer", label: "Complement" }],
  title: "Modular Complement Calculator",
});
export const runModularComplement = modularComplementTool.execute;
export default modularComplementTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const equilibriumConstantKcExample = {
  input: { exponentP: 2, exponentR: 1, productConc: 4, reactantConc: 2 },
} satisfies ToolExample<{
  readonly exponentP: number;
  readonly exponentR: number;
  readonly productConc: number;
  readonly reactantConc: number;
}>;

export const equilibriumConstantKcTool = createSimpleTool({
  id: "chemistry/equilibrium-constant-kc",
  title: "Kc From Equilibrium Conc",
  description:
    "Compute the equilibrium constant Kc as equilibrium product concentration to power p over reactant concentration to power r.",
  inputs: [
    { id: "productConc", label: "Product concentration", kind: "number" },
    { id: "reactantConc", label: "Reactant concentration", kind: "number" },
    { id: "exponentP", label: "Product exponent", kind: "number", minimum: 0 },
    { id: "exponentR", label: "Reactant exponent", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "kc", label: "Equilibrium constant Kc", kind: "number" }],
  calculate: (input) => {
    const productConc = input.productConc as number;
    const reactantConc = input.reactantConc as number;
    const exponentP = input.exponentP as number;
    const exponentR = input.exponentR as number;
    if (!(productConc > 0))
      simpleError("productConc", "Product concentration must be positive.");
    if (!(reactantConc > 0))
      simpleError("reactantConc", "Reactant concentration must be positive.");
    return {
      kc: Math.pow(productConc, exponentP) / Math.pow(reactantConc, exponentR),
    };
  },
});
export const runEquilibriumConstantKc = equilibriumConstantKcTool.execute;
export default equilibriumConstantKcTool;

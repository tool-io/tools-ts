import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const reactionQuotientExample = {
  input: { concProduct: 0.5, concReactant: 2, exponentP: 1, exponentR: 1 },
} satisfies ToolExample<{
  readonly concProduct: number;
  readonly concReactant: number;
  readonly exponentP: number;
  readonly exponentR: number;
}>;

export const reactionQuotientTool = createSimpleTool({
  id: "chemistry/reaction-quotient",
  title: "Reaction Quotient Q Calculator",
  description:
    "Compute the reaction quotient as product concentration to power p over reactant concentration to power r.",
  inputs: [
    { id: "concProduct", label: "Product concentration", kind: "number" },
    { id: "concReactant", label: "Reactant concentration", kind: "number" },
    { id: "exponentP", label: "Product exponent", kind: "number", minimum: 0 },
    { id: "exponentR", label: "Reactant exponent", kind: "number", minimum: 0 },
  ],
  outputs: [
    { id: "reactionQuotient", label: "Reaction quotient Q", kind: "number" },
  ],
  calculate: (input) => {
    const concProduct = input.concProduct as number;
    const concReactant = input.concReactant as number;
    const exponentP = input.exponentP as number;
    const exponentR = input.exponentR as number;
    if (!(concProduct > 0))
      simpleError("concProduct", "Product concentration must be positive.");
    if (!(concReactant > 0))
      simpleError("concReactant", "Reactant concentration must be positive.");
    return {
      reactionQuotient:
        Math.pow(concProduct, exponentP) / Math.pow(concReactant, exponentR),
    };
  },
});
export const runReactionQuotient = reactionQuotientTool.execute;
export default reactionQuotientTool;

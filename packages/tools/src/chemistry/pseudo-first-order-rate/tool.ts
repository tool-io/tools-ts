import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pseudoFirstOrderRateExample = {
  input: { excessReactantConcM: 0.4, rateConstantSecondOrder: 2.5 },
} satisfies ToolExample<{
  readonly excessReactantConcM: number;
  readonly rateConstantSecondOrder: number;
}>;

export const pseudoFirstOrderRateTool = createSimpleTool({
  id: "chemistry/pseudo-first-order-rate",
  title: "Pseudo First Order Rate",
  description:
    "Compute the observed pseudo first order rate constant for a second order reaction with one reactant in large excess.",
  inputs: [
    {
      id: "rateConstantSecondOrder",
      label: "Second-order rate constant",
      kind: "number",
      unit: "1/(M\u00B7s)",
    },
    {
      id: "excessReactantConcM",
      label: "Excess reactant concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      id: "observedRateConstant",
      label: "Observed rate constant",
      kind: "number",
      unit: "1/s",
    },
  ],
  calculate: (input) => {
    const rateConstantSecondOrder = input.rateConstantSecondOrder as number;
    const excessReactantConcM = input.excessReactantConcM as number;
    if (!(rateConstantSecondOrder > 0))
      simpleError("rateConstantSecondOrder", "Rate constant must be positive.");
    if (!(excessReactantConcM > 0))
      simpleError(
        "excessReactantConcM",
        "Excess reactant concentration must be positive.",
      );
    return {
      observedRateConstant: rateConstantSecondOrder * excessReactantConcM,
    };
  },
});
export const runPseudoFirstOrderRate = pseudoFirstOrderRateTool.execute;
export default pseudoFirstOrderRateTool;

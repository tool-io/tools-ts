import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const uvLogReductionCalculatorExample = {
  input: { initialCfuPerMl: 1000000, survivingCfuPerMl: 1000 },
  output: { uvLogReduction: 3 },
} satisfies ToolExample<
  { readonly initialCfuPerMl: number; readonly survivingCfuPerMl: number },
  { readonly uvLogReduction: number }
>;

export const uvLogReductionCalculatorTool = createSimpleTool({
  id: "mycology/uv-survival-logreduction-jm2-calculator",
  title: "UV Log Reduction",
  description:
    "Calculate base-10 viable-count reduction from initial and surviving CFU/mL; the result is not normalized by UV dose because no irradiance or exposure input is supplied.",
  inputs: [
    {
      id: "initialCfuPerMl",
      kind: "number",
      label: "Initial CFU/mL",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "survivingCfuPerMl",
      kind: "number",
      label: "Surviving CFU/mL",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "uvLogReduction", kind: "number", label: "UV log reduction" },
  ],
  calculate: (input) => {
    const initialCfuPerMl = input.initialCfuPerMl as number;
    const survivingCfuPerMl = input.survivingCfuPerMl as number;
    if (survivingCfuPerMl === 0)
      simpleError(
        "survivingCfuPerMl",
        "Zero survivors indicates sterilization; log reduction is undefined.",
        "zero_survivors",
      );
    if (survivingCfuPerMl > initialCfuPerMl)
      simpleError(
        "survivingCfuPerMl",
        "Surviving CFU/mL cannot exceed the initial count for a log-reduction result.",
        "survivors_exceed_initial",
      );
    return {
      uvLogReduction: Math.log10(initialCfuPerMl / survivingCfuPerMl),
    };
  },
});
export const runUvLogReductionCalculator = uvLogReductionCalculatorTool.execute;
export default uvLogReductionCalculatorTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const epgMcmasterCalculatorExample = {
  input: { eggsCounted: 4 },
} satisfies ToolExample<{
  readonly chamberFactor?: number;
  readonly eggsCounted: number;
}>;

export const epgMcmasterCalculatorTool = createSimpleTool({
  id: "parasitology/epg-mcmaster-calculator",
  title: "McMaster EPG Calculator",
  description:
    "Compute fecal egg counts in eggs per gram with the documented simple McMaster form: eggs counted in one chamber grid multiplied by the chamber factor, fifty with standard dilution adjustment.",
  inputs: [
    { id: "eggsCounted", label: "Eggs counted", kind: "integer", minimum: 0 },
    {
      default: 50,
      id: "chamberFactor",
      label: "Chamber factor",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [{ id: "eggsPerGram", label: "Eggs per gram", kind: "number" }],
  calculate: (input) => ({
    eggsPerGram:
      (input.eggsCounted as number) * (input.chamberFactor as number),
  }),
});
export const runEpgMcmasterCalculator = epgMcmasterCalculatorTool.execute;
export default epgMcmasterCalculatorTool;

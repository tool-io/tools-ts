import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{ hatchedEggs: number; eggsTested: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "hatchedEggs", label: "Hatched eggs", kind: "number" },
  { id: "eggsTested", label: "Eggs tested", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    hatchRatePercent: 100 * countFraction(i.hatchedEggs, i.eggsTested),
    causalInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { hatchedEggs: 2, eggsTested: 10 },
  output: {
    result: { hatchRatePercent: 20.0, causalInference: "not-established" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/schisto-egg-hatch-rate-percent-calculator",
  title: "Schistosome Egg Viability Hatch Rate Percent Calculator",
  description:
    "Compute the observed Schistosome Egg Viability Hatch Rate Percent Calculator fraction from explicit subset and total counts; not a transmission, survival or viability guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hatchRatePercent: { type: "number" },
          causalInference: { type: "string" },
        },
        required: ["hatchRatePercent", "causalInference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

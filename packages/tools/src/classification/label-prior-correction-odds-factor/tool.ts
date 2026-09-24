import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ trainingPrior: number; targetPrior: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "trainingPrior", label: "Training prior", kind: "number" },
  { id: "targetPrior", label: "Target prior", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.trainingPrior > 0 &&
      i.trainingPrior < 1 &&
      i.targetPrior > 0 &&
      i.targetPrior < 1,
  );
  return H.finish({
    posteriorOddsFactor:
      i.targetPrior /
      (1 - i.targetPrior) /
      (i.trainingPrior / (1 - i.trainingPrior)),
  });
};
export const example = {
  input: { trainingPrior: 0.5, targetPrior: 0.2 },
  output: { result: { posteriorOddsFactor: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/label-prior-correction-odds-factor",
  title: "Classification: Label Prior Correction Odds Factor Tool",
  description:
    "Compute binary posterior-odds prior-shift correction under caller-established unchanged class-conditional distributions; no calibration or domain-shift validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { posteriorOddsFactor: { type: "number" } },
        required: ["posteriorOddsFactor"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

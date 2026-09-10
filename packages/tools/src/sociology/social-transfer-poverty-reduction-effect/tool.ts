import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMatchedPreTransferPovertyPercent: number;
  readonly independentlyMatchedPostTransferPovertyPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMatchedPreTransferPovertyPercent",
    label: "Independently matched pre transfer poverty percent",
    kind: "number",
  },
  {
    id: "independentlyMatchedPostTransferPovertyPercent",
    label: "Independently matched post transfer poverty percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyMatchedPreTransferPovertyPercent <= 0 ||
    input.independentlyMatchedPreTransferPovertyPercent > 100 ||
    input.independentlyMatchedPostTransferPovertyPercent < 0 ||
    input.independentlyMatchedPostTransferPovertyPercent > 100
  )
    simpleError(
      "rates",
      "Compatible percentages with positive pre-transfer rate.",
    );
  const d =
    input.independentlyMatchedPreTransferPovertyPercent -
    input.independentlyMatchedPostTransferPovertyPercent;
  return {
    signedPovertyReductionPercentagePoints: d,
    relativeReductionPercent:
      (100 * d) / input.independentlyMatchedPreTransferPovertyPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMatchedPreTransferPovertyPercent: 30,
    independentlyMatchedPostTransferPovertyPercent: 20,
  },
  output: {
    result: {
      signedPovertyReductionPercentagePoints: 10,
      relativeReductionPercent: 33.333333333333336,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/social-transfer-poverty-reduction-effect",
  title: "Social Transfer Poverty Reduction Effect Calculator",
  description:
    "Actual matched pre/post transfer poverty rates; signed difference, not causal transfer effectiveness without counterfactual design. Population/income definitions and applicable poverty lines independently harmonized.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUrineProteinConcentration: number;
  readonly independentlyMatchedUrineCreatinineConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUrineProteinConcentration",
    label: "Independently measured urine protein concentration",
    kind: "number",
  },
  {
    id: "independentlyMatchedUrineCreatinineConcentration",
    label: "Independently matched urine creatinine concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyMeasuredUrineProteinConcentration,
    "numerator",
  );
  positive(
    input.independentlyMatchedUrineCreatinineConcentration,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.independentlyMeasuredUrineProteinConcentration) /
      input.independentlyMatchedUrineCreatinineConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUrineProteinConcentration: 2,
    independentlyMatchedUrineCreatinineConcentration: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/upc-ratio-proteinuria-canine",
  title: "Canine UPC Proteinuria Ratio Calculator",
  description:
    "Canine UPCratio using independently qualified same-sample/same-concentration-unit laboratory values. Sediment, infection and clinical diagnosis external. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  observedMonomerCopies: number;
  callerMonomerLengthBp: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedMonomerCopies",
    label: "Observed monomer copies",
    kind: "number",
  },
  {
    id: "callerMonomerLengthBp",
    label: "Caller monomer length bp",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.observedMonomerCopies, "copies", 0, 1e9);
  bounded(i.callerMonomerLengthBp, "monomer", 1, 10000);
  return {
    conditionalArrayLengthBp: i.observedMonomerCopies * i.callerMonomerLengthBp,
    gapsOrSequenceVariationIncluded: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { observedMonomerCopies: 10, callerMonomerLengthBp: 171 },
  output: {
    result: {
      conditionalArrayLengthBp: 1710,
      gapsOrSequenceVariationIncluded: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/centromere-alpha-repeat-array-estimator",
  title: "Centromeric Alpha Repeat Monomer Array Length Estimator",
  description:
    "Estimate alpha-repeat length from independently observed copies and monomer length; no assumed exact universal 171-bp composition.",
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
          conditionalArrayLengthBp: { type: "number" },
          gapsOrSequenceVariationIncluded: { type: "boolean" },
        },
        required: [
          "conditionalArrayLengthBp",
          "gapsOrSequenceVariationIncluded",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

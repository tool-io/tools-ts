import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyClassifiedShearingCrestLength: number;
  readonly actualMatchedToothReferenceLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyClassifiedShearingCrestLength",
    label: "Actual independently classified shearing crest length",
    kind: "number",
  },
  {
    id: "actualMatchedToothReferenceLength",
    label: "Actual matched tooth reference length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyClassifiedShearingCrestLength,
    "actualIndependentlyClassifiedShearingCrestLength",
  );
  positive(
    input.actualMatchedToothReferenceLength,
    "actualMatchedToothReferenceLength",
  );
  return {
    value:
      input.actualIndependentlyClassifiedShearingCrestLength /
      input.actualMatchedToothReferenceLength,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyClassifiedShearingCrestLength: 1,
    actualMatchedToothReferenceLength: 2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/shearing-crest-ratio",
  title: "Shearing Crest Length Ratio Calculator",
  description:
    "Actualshearingcrest/toothreference-lengthratio,not directlyinferdietfromundefinedlandmarks. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

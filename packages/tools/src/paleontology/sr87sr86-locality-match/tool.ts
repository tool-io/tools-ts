import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSr87Sr86Ratio: number;
  readonly callerIndependentlyVerifiedLocalLowerRatio: number;
  readonly callerIndependentlyVerifiedLocalUpperRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSr87Sr86Ratio",
    label: "Actual sr87 sr86 ratio",
    kind: "number",
  },
  {
    id: "callerIndependentlyVerifiedLocalLowerRatio",
    label: "Caller independently verified local lower ratio",
    kind: "number",
  },
  {
    id: "callerIndependentlyVerifiedLocalUpperRatio",
    label: "Caller independently verified local upper ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualSr87Sr86Ratio, "ratio");
  positive(input.callerIndependentlyVerifiedLocalLowerRatio, "lower");
  if (
    input.callerIndependentlyVerifiedLocalUpperRatio <
    input.callerIndependentlyVerifiedLocalLowerRatio
  )
    simpleError("range", "Orderedindependentlyestablishedlocalrange.");
  return {
    overlapsCallerLocalRange:
      input.actualSr87Sr86Ratio >=
        input.callerIndependentlyVerifiedLocalLowerRatio &&
      input.actualSr87Sr86Ratio <=
        input.callerIndependentlyVerifiedLocalUpperRatio,
    signedLowerMargin:
      input.actualSr87Sr86Ratio -
      input.callerIndependentlyVerifiedLocalLowerRatio,
    signedUpperMargin:
      input.callerIndependentlyVerifiedLocalUpperRatio -
      input.actualSr87Sr86Ratio,
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
    actualSr87Sr86Ratio: 0.71,
    callerIndependentlyVerifiedLocalLowerRatio: 0.7,
    callerIndependentlyVerifiedLocalUpperRatio: 0.72,
  },
  output: {
    result: {
      overlapsCallerLocalRange: true,
      signedLowerMargin: 0.010000000000000009,
      signedUpperMargin: 0.010000000000000009,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/sr87sr86-locality-match",
  title: "Sr87/Sr86 Locality Match Checker",
  description:
    "Actual87Sr/86Sroverlapindependentlocalrangeonly,not provenanceassignment/migration/localityidentity/uniquegeology. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

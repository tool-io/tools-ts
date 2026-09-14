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
  readonly actualObservedEndocranialVolume: number;
  readonly callerIndependentApplicableExpectedEndocranialVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedEndocranialVolume",
    label: "Actual observed endocranial volume",
    kind: "number",
  },
  {
    id: "callerIndependentApplicableExpectedEndocranialVolume",
    label: "Caller independent applicable expected endocranial volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualObservedEndocranialVolume,
    "actualObservedEndocranialVolume",
  );
  positive(
    input.callerIndependentApplicableExpectedEndocranialVolume,
    "callerIndependentApplicableExpectedEndocranialVolume",
  );
  return {
    value:
      input.actualObservedEndocranialVolume /
      input.callerIndependentApplicableExpectedEndocranialVolume,
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
    actualObservedEndocranialVolume: 2,
    callerIndependentApplicableExpectedEndocranialVolume: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/encephalization-quotient-fossil",
  title: "Encephalization Quotient Fossil Calculator",
  description:
    "FossilEQmeasuredendocranialV/INDEPENDENTtaxon-specificexpectedV,samevolumebasis,not primatebrainmasslineor intelligence inference. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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

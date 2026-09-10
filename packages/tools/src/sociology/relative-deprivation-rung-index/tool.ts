import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedReferenceRung: number;
  readonly independentlyReportedPersonalRung: number;
  readonly callerLadderMaximumRung: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedReferenceRung",
    label: "Independently established reference rung",
    kind: "number",
  },
  {
    id: "independentlyReportedPersonalRung",
    label: "Independently reported personal rung",
    kind: "number",
  },
  {
    id: "callerLadderMaximumRung",
    label: "Caller ladder maximum rung",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerLadderMaximumRung, "ladder");
  if (
    [
      input.independentlyEstablishedReferenceRung,
      input.independentlyReportedPersonalRung,
    ].some((v) => v < 0 || v > input.callerLadderMaximumRung)
  )
    simpleError("rung", "Rungs within declared ladder.");
  return {
    signedRelativeRungGapFraction:
      (input.independentlyEstablishedReferenceRung -
        input.independentlyReportedPersonalRung) /
      input.callerLadderMaximumRung,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedReferenceRung: 8,
    independentlyReportedPersonalRung: 5,
    callerLadderMaximumRung: 10,
  },
  output: { result: { signedRelativeRungGapFraction: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/relative-deprivation-rung-index",
  title: "Relative Deprivation Rung Index Calculator",
  description:
    "Conditional subjective ladder gap under an independently declared reference and maximum, not actual economic deprivation, mental-health diagnosis or universal status scale.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerReviewedReportingFrame: string;
  readonly callerReviewedAccusativeSubject: string;
  readonly callerReviewedInfinitivePhrase: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerReviewedReportingFrame",
    label: "Caller reviewed reporting frame",
    kind: "string",
  },
  {
    id: "callerReviewedAccusativeSubject",
    label: "Caller reviewed accusative subject",
    kind: "string",
  },
  {
    id: "callerReviewedInfinitivePhrase",
    label: "Caller reviewed infinitive phrase",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [
      input.callerReviewedReportingFrame,
      input.callerReviewedAccusativeSubject,
      input.callerReviewedInfinitivePhrase,
    ].some((v) => !v.trim() || /[.\r\n]/.test(v))
  )
    simpleError(
      "phrases",
      "Explicit independently reviewed Latin reporting frame, accusative subject and tense-appropriate infinitive phrase.",
    );
  return {
    indirectStatement: [
      input.callerReviewedReportingFrame,
      input.callerReviewedAccusativeSubject,
      input.callerReviewedInfinitivePhrase,
    ].join(" "),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerReviewedReportingFrame: "dicit",
    callerReviewedAccusativeSubject: "eum",
    callerReviewedInfinitivePhrase: "venire",
  },
  output: { result: { indirectStatement: "dicit eum venire" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/indirect-statement-acc-inf-transformer",
  title: "Indirect Statement ACC-INF Transformer",
  description:
    "Assemble explicitly independently transformed Latin ACC-INF parts; caller resolves pronoun reference, agreement and relative tense. No arbitrary direct-statement parser or morphological transformation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

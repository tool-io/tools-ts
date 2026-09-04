import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerReviewedUtterance: string;
  readonly callerReviewedPunAdverb: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerReviewedUtterance",
    label: "Caller reviewed utterance",
    kind: "string",
  },
  {
    id: "callerReviewedPunAdverb",
    label: "Caller reviewed pun adverb",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.callerReviewedUtterance.trim() ||
    !input.callerReviewedPunAdverb.trim() ||
    input.callerReviewedUtterance.length > 256 ||
    input.callerReviewedPunAdverb.length > 64 ||
    /["\r\n]/.test(input.callerReviewedUtterance) ||
    /[.\r\n]/.test(input.callerReviewedPunAdverb)
  )
    simpleError(
      "phrases",
      "Reviewed bounded plain utterance and punning adverb phrase without embedded quotation/newline.",
    );
  return {
    tomSwifty:
      '"' +
      input.callerReviewedUtterance +
      '," Tom said ' +
      input.callerReviewedPunAdverb +
      ".",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerReviewedUtterance: "I need another pencil",
    callerReviewedPunAdverb: "pointedly",
  },
  output: {
    result: { tomSwifty: '"I need another pencil," Tom said pointedly.' },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/tom-swifty-pun-format-generator",
  title: "Tom Swifty Pun Format Generator",
  description:
    "Serialize caller independently reviewed utterance and punning adverb in a Tom Swifty frame; no automatic pun inference or language-quality assurance.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Roman dodecahedra are hollow twelve-faced artifacts with varying apertures/knobs whose purpose remains unsettled.",
        reference:
          "Roman artifact catalogues and archaeological interpretation scholarship.",
        limitations:
          "Knitting, measurement and ritual theories are hypotheses, not established universal functions.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Roman dodecahedra are hollow twelve-faced artifacts with varying apertures/knobs whose purpose remains unsettled.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/roman-dodecahedron-purpose-unknown-artifact-mystery-lookup",
  title: "Roman Dodecahedron Purpose Unknown Artifact Mystery Lookup",
  description:
    "Bounded offline reference: Roman dodecahedra are hollow twelve-faced artifacts with varying apertures/knobs whose purpose remains unsettled. Source: Roman artifact catalogues and archaeological interpretation scholarship. Knitting, measurement and ritual theories are hypotheses, not established universal functions. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

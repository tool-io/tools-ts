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
          "Tetradrachm denotes four drachms within a monetary standard, not one universal gram weight.",
        reference: "Greek numismatic weight-standard scholarship.",
        limitations:
          "Attic, Rhodian, Ptolemaic and other standards differ; measured coins vary with wear and production.",
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
      text: "Tetradrachm denotes four drachms within a monetary standard, not one universal gram weight.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/tetradrachm-standard-weight-lookup",
  title: "Tetradrachm Standard Weight Lookup",
  description:
    "Bounded offline reference: Tetradrachm denotes four drachms within a monetary standard, not one universal gram weight. Source: Greek numismatic weight-standard scholarship. Attic, Rhodian, Ptolemaic and other standards differ; measured coins vary with wear and production. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

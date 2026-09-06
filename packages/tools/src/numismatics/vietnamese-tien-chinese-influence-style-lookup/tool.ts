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
          "Vietnamese cash coinage reflects changing local political/monetary contexts alongside Chinese-influenced forms.",
        reference: "Vietnamese numismatic histories and catalogues.",
        limitations:
          "Style similarity does not identify issuing authority or establish a single Chinese origin for every coin.",
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
      text: "Vietnamese cash coinage reflects changing local political/monetary contexts alongside Chinese-influenced forms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/vietnamese-tien-chinese-influence-style-lookup",
  title: "Vietnamese Tien Chinese Influence Style Lookup",
  description:
    "Bounded offline reference: Vietnamese cash coinage reflects changing local political/monetary contexts alongside Chinese-influenced forms. Source: Vietnamese numismatic histories and catalogues. Style similarity does not identify issuing authority or establish a single Chinese origin for every coin. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

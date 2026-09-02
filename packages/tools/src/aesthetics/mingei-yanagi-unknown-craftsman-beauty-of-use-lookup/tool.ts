import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Yanagis mingei discourse values everyday craft, use and often anonymous makers within a historically situated movement.",
        reference: "Yanagi, The Unknown Craftsman.",
        limitations:
          "Not proof of one timeless Japanese folk essence or permission to erase makers/community ownership.",
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
      text: "Yanagis mingei discourse values everyday craft, use and often anonymous makers within a historically situated movement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/mingei-yanagi-unknown-craftsman-beauty-of-use-lookup",
  title: "Mingei Yanagi Unknown Craftsman Beauty of Use Lookup",
  description:
    "Bounded offline reference: Yanagis mingei discourse values everyday craft, use and often anonymous makers within a historically situated movement. Source: Yanagi, The Unknown Craftsman. Not proof of one timeless Japanese folk essence or permission to erase makers/community ownership. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

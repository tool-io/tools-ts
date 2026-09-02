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
          "Suetonius reports Caligulas troops gathering shells as spoils of the ocean; historical meaning and corroboration are disputed.",
        reference: "Suetonius, Caligula 46.",
        limitations:
          "The Neptune-war summary is not an independently established literal campaign motive or clinical diagnosis.",
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
      text: "Suetonius reports Caligulas troops gathering shells as spoils of the ocean; historical meaning and corroboration are disputed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/caligula-neptune-war-shell-collection-episode-sources",
  title: "Caligula Neptune War Shell Collection Episode Sources",
  description:
    "Bounded offline reference: Suetonius reports Caligulas troops gathering shells as spoils of the ocean; historical meaning and corroboration are disputed. Source: Suetonius, Caligula 46. The Neptune-war summary is not an independently established literal campaign motive or clinical diagnosis. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

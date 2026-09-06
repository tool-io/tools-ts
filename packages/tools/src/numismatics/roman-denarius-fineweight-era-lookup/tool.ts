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
          "Roman denarius weight/fineness changed across issues, eras and mint practices, including debasement.",
        reference:
          "Roman Imperial Coinage; Roman monetary-history scholarship.",
        limitations:
          "No single nominal mass or fineness applies to all denarii; require exact issue, assay and source.",
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
      text: "Roman denarius weight/fineness changed across issues, eras and mint practices, including debasement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/roman-denarius-fineweight-era-lookup",
  title: "Roman Denarius Fineweight Era Lookup",
  description:
    "Bounded offline reference: Roman denarius weight/fineness changed across issues, eras and mint practices, including debasement. Source: Roman Imperial Coinage; Roman monetary-history scholarship. No single nominal mass or fineness applies to all denarii; require exact issue, assay and source. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

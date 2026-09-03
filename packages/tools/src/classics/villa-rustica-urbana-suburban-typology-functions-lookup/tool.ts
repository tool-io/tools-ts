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
          "Villa rustica, urbana and suburban terminology distinguishes contexts/functions but does not form a universally exclusive archaeological taxonomy.",
        reference: "Varro, De re rustica; Roman villa archaeology.",
        limitations:
          "Mixed residential/agricultural functions and period differences matter; not a land-use/legal classification.",
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
      text: "Villa rustica, urbana and suburban terminology distinguishes contexts/functions but does not form a universally exclusive archaeological taxonomy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/villa-rustica-urbana-suburban-typology-functions-lookup",
  title: "Villa Rustica Urbana Suburban Typology Functions Lookup",
  description:
    "Bounded offline reference: Villa rustica, urbana and suburban terminology distinguishes contexts/functions but does not form a universally exclusive archaeological taxonomy. Source: Varro, De re rustica; Roman villa archaeology. Mixed residential/agricultural functions and period differences matter; not a land-use/legal classification. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

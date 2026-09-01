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
          "Biennales may combine national pavilions, curated exhibitions and collateral formats; organization varies by event and year.",
        reference: "Biennale exhibition histories and official catalogues.",
        limitations:
          "No complete current pavilion list or inference of an artists nationality/representation fabricated.",
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
      text: "Biennales may combine national pavilions, curated exhibitions and collateral formats; organization varies by event and year.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/biennale-national-pavilion-representation-format-lookup",
  title: "Biennale National Pavilion Representation Format Lookup",
  description:
    "Bounded offline reference: Biennales may combine national pavilions, curated exhibitions and collateral formats; organization varies by event and year. Source: Biennale exhibition histories and official catalogues. No complete current pavilion list or inference of an artists nationality/representation fabricated. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

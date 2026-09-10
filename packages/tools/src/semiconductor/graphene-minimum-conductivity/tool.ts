import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch48-shared.js";
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
          "Graphene minimum conductivity depends on geometry, disorder, contacts, temperature and the defined conductivity/transport limit; no single universal measured minimum follows from the name.",
        reference:
          "Graphene transport and Dirac-point conductivity literature.",
        limitations:
          "Idealized4e\u00b2/(\u03c0h) and experimental order4e\u00b2/hconventions describe different assumptions; use actual independently applicable transport model, not a material constant.",
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
      text: "Graphene minimum conductivity depends on geometry, disorder, contacts, temperature and the defined conductivity/transport limit; no single universal measured minimum follows from the name.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/graphene-minimum-conductivity",
  title: "Semiconductor Graphene Minimum Conductivity Calculator",
  description:
    "Bounded offline reference: Graphene minimum conductivity depends on geometry, disorder, contacts, temperature and the defined conductivity/transport limit; no single universal measured minimum follows from the name. Source: Graphene transport and Dirac-point conductivity literature. Idealized4e\u00b2/(\u03c0h) and experimental order4e\u00b2/hconventions describe different assumptions; use actual independently applicable transport model, not a material constant. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

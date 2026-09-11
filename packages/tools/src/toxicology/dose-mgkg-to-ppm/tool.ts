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
          "1mg perkg of the same specified material is1ppm by mass; administered dose mg/kg body mass is not environmental ppm without an independently established exposure/intake relationship.",
        reference: "SI mass-fraction dimensional analysis.",
        limitations:
          "No density, chemical identity, intake or route-specific dose is invented; choose actual independently established concentration/intake model.",
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
      text: "1mg perkg of the same specified material is1ppm by mass; administered dose mg/kg body mass is not environmental ppm without an independently established exposure/intake relationship.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/dose-mgkg-to-ppm",
  title: "Dose mg/kg to ppm Converter",
  description:
    "Bounded offline reference: 1mg perkg of the same specified material is1ppm by mass; administered dose mg/kg body mass is not environmental ppm without an independently established exposure/intake relationship. Source: SI mass-fraction dimensional analysis. No density, chemical identity, intake or route-specific dose is invented; choose actual independently established concentration/intake model. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
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

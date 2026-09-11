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
          "ppm by mass is mg/kg of the same specified material; environmental ppm does not itself specify an administered mg/kg body-mass dose. ppm by volume and mass also differ.",
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
      text: "ppm by mass is mg/kg of the same specified material; environmental ppm does not itself specify an administered mg/kg body-mass dose. ppm by volume and mass also differ.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/dose-ppm-to-mgkg",
  title: "Dose ppm to mg/kg Converter",
  description:
    "Bounded offline reference: ppm by mass is mg/kg of the same specified material; environmental ppm does not itself specify an administered mg/kg body-mass dose. ppm by volume and mass also differ. Source: SI mass-fraction dimensional analysis. No density, chemical identity, intake or route-specific dose is invented; choose actual independently established concentration/intake model. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
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

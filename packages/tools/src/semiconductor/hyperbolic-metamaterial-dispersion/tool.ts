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
          "Uniaxial hyperbolic dispersion uses opposite signs of principal permittivity components under a stipulated constitutive model.",
        reference: "Hyperbolic metamaterial electromagnetic theory.",
        limitations:
          "Finite loss, nonlocality and homogenization limits matter; an indefinite-sign observation is not a fabricated real material dispersion curve.",
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
      text: "Uniaxial hyperbolic dispersion uses opposite signs of principal permittivity components under a stipulated constitutive model.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/hyperbolic-metamaterial-dispersion",
  title: "Semiconductor Hyperbolic Metamaterial Dispersion Calculator",
  description:
    "Bounded offline reference: Uniaxial hyperbolic dispersion uses opposite signs of principal permittivity components under a stipulated constitutive model. Source: Hyperbolic metamaterial electromagnetic theory. Finite loss, nonlocality and homogenization limits matter; an indefinite-sign observation is not a fabricated real material dispersion curve. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
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

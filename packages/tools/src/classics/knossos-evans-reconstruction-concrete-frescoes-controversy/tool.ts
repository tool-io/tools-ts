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
          "Arthur Evans Knossos reconstructions used modern materials and interpretive restorations that remain debated.",
        reference: "Knossos excavation/restoration scholarship.",
        limitations:
          "Concrete/fresco appearance can embody modern hypotheses, not direct proof of ancient form or use.",
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
      text: "Arthur Evans Knossos reconstructions used modern materials and interpretive restorations that remain debated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/knossos-evans-reconstruction-concrete-frescoes-controversy",
  title: "Knossos Evans Reconstruction Concrete Frescoes Controversy",
  description:
    "Bounded offline reference: Arthur Evans Knossos reconstructions used modern materials and interpretive restorations that remain debated. Source: Knossos excavation/restoration scholarship. Concrete/fresco appearance can embody modern hypotheses, not direct proof of ancient form or use. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "OBLAat4mmol/Lis an operational fixed-lactate convention, while individual lactate thresholds depend on protocol and response.",
        reference: "Lactate-threshold exercise physiology.",
        limitations:
          "The4mmolpoint is not universally a persons threshold, training zone or safe exertion limit.",
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
      text: "OBLAat4mmol/Lis an operational fixed-lactate convention, while individual lactate thresholds depend on protocol and response.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/obla-onset-blood-lactate-4mmol-versus-individual-threshold",
  title: "Obla Onset Blood Lactate 4mmol Versus Individual Threshold",
  description:
    "Bounded offline reference: OBLAat4mmol/Lis an operational fixed-lactate convention, while individual lactate thresholds depend on protocol and response. Source: Lactate-threshold exercise physiology. The4mmolpoint is not universally a persons threshold, training zone or safe exertion limit. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

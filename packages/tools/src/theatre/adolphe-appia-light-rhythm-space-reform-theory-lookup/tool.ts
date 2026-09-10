import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Appia emphasized relationships among light, rhythm, body and three-dimensional stage space in reforming scenic practice.",
        reference:
          "Appia, Music and the Art of the Theatre; The Work of Living Art.",
        limitations:
          "Historical theory, not one universal light layout or physical training protocol.",
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
      text: "Appia emphasized relationships among light, rhythm, body and three-dimensional stage space in reforming scenic practice.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/adolphe-appia-light-rhythm-space-reform-theory-lookup",
  title: "Adolphe Appia Light Rhythm Space Reform Theory Lookup",
  description:
    "Bounded offline reference: Appia emphasized relationships among light, rhythm, body and three-dimensional stage space in reforming scenic practice. Source: Appia, Music and the Art of the Theatre; The Work of Living Art. Historical theory, not one universal light layout or physical training protocol. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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

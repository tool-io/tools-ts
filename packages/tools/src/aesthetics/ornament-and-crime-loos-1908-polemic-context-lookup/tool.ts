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
          "Loos Ornament and Crime is a polemical modernist text containing historically problematic evolutionary/racial rhetoric.",
        reference: "Loos, Ornament and Crime, publication/lecture history.",
        limitations:
          "The often-cited 1908 date is contested in chronology; description does not endorse the prejudices.",
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
      text: "Loos Ornament and Crime is a polemical modernist text containing historically problematic evolutionary/racial rhetoric.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/ornament-and-crime-loos-1908-polemic-context-lookup",
  title: "Ornament and Crime Loos 1908 Polemic Context Lookup",
  description:
    "Bounded offline reference: Loos Ornament and Crime is a polemical modernist text containing historically problematic evolutionary/racial rhetoric. Source: Loos, Ornament and Crime, publication/lecture history. The often-cited 1908 date is contested in chronology; description does not endorse the prejudices. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

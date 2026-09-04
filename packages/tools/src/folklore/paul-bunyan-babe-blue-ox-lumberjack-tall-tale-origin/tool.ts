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
          "Paul Bunyan and Babe the blue ox belong to lumberjack tall-tale traditions strongly developed through print and advertising.",
        reference:
          "Dorson, American Folklore; logging-company promotional material history.",
        limitations:
          "Commercial development complicates claims of a single ancient oral origin.",
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
      text: "Paul Bunyan and Babe the blue ox belong to lumberjack tall-tale traditions strongly developed through print and advertising.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/paul-bunyan-babe-blue-ox-lumberjack-tall-tale-origin",
  title: "Paul Bunyan Babe Blue Ox Lumberjack Tall Tale Origin",
  description:
    "Bounded offline reference: Paul Bunyan and Babe the blue ox belong to lumberjack tall-tale traditions strongly developed through print and advertising. Source: Dorson, American Folklore; logging-company promotional material history. Commercial development complicates claims of a single ancient oral origin. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

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
          "The conventional seven are Giza pyramid, Babylon hanging gardens, Olympia Zeus, Ephesus Artemis, Mausoleum at Halicarnassus, Rhodes colossus, and Alexandria lighthouse.",
        reference: "Ancient Seven Wonders list tradition.",
        limitations:
          "Only the Giza pyramid substantially survives; list traditions and hanging-gardens location/identity are debated.",
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
      text: "The conventional seven are Giza pyramid, Babylon hanging gardens, Olympia Zeus, Ephesus Artemis, Mausoleum at Halicarnassus, Rhodes colossus, and Alexandria lighthouse.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/seven-wonders-surviving-giza-only-list-lookup",
  title: "Seven Wonders Surviving Giza Only List Lookup",
  description:
    "Offline bounded reference card: The conventional seven are Giza pyramid, Babylon hanging gardens, Olympia Zeus, Ephesus Artemis, Mausoleum at Halicarnassus, Rhodes colossus, and Alexandria lighthouse. References Ancient Seven Wonders list tradition. Only the Giza pyramid substantially survives; list traditions and hanging-gardens location/identity are debated.",
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

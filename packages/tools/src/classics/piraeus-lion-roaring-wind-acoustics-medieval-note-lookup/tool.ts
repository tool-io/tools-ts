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
          "The Piraeus Lion is an ancient sculpture with later Scandinavian runic inscriptions and a later Venetian location.",
        reference: "Piraeus Lion art-historical/runological scholarship.",
        limitations:
          "A roaring-wind mechanism is not securely established by the title; no invented acoustical apparatus or confirmed medieval sound performance.",
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
      text: "The Piraeus Lion is an ancient sculpture with later Scandinavian runic inscriptions and a later Venetian location.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/piraeus-lion-roaring-wind-acoustics-medieval-note-lookup",
  title: "Piraeus Lion Roaring Wind Acoustics Medieval Note Lookup",
  description:
    "Bounded offline reference: The Piraeus Lion is an ancient sculpture with later Scandinavian runic inscriptions and a later Venetian location. Source: Piraeus Lion art-historical/runological scholarship. A roaring-wind mechanism is not securely established by the title; no invented acoustical apparatus or confirmed medieval sound performance. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

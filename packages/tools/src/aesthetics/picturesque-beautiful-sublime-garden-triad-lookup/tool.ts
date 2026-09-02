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
          "Picturesque discourse mediates and contests beautiful/sublime categories through roughness, variety and landscape composition.",
        reference:
          "Gilpin, Observations; Price, Essay on the Picturesque 1794.",
        limitations:
          "Historical garden/landscape theories differ, not universal environmental or safety categories.",
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
      text: "Picturesque discourse mediates and contests beautiful/sublime categories through roughness, variety and landscape composition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/picturesque-beautiful-sublime-garden-triad-lookup",
  title: "Picturesque Beautiful Sublime Garden Triad Lookup",
  description:
    "Bounded offline reference: Picturesque discourse mediates and contests beautiful/sublime categories through roughness, variety and landscape composition. Source: Gilpin, Observations; Price, Essay on the Picturesque 1794. Historical garden/landscape theories differ, not universal environmental or safety categories. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

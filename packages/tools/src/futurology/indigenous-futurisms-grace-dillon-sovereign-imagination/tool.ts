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
          "Indigenous Futurisms centers diverse Indigenous speculative imaginations, sovereignty and relationships to time, land and community.",
        reference: "GraceDillon, Walking the Clouds 2012.",
        limitations:
          "Not one homogeneous aesthetic; community authority, attribution and consent matter.",
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
      text: "Indigenous Futurisms centers diverse Indigenous speculative imaginations, sovereignty and relationships to time, land and community.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/indigenous-futurisms-grace-dillon-sovereign-imagination",
  title: "Indigenous Futurisms Grace Dillon Sovereign Imagination",
  description:
    "Bounded offline reference: Indigenous Futurisms centers diverse Indigenous speculative imaginations, sovereignty and relationships to time, land and community. Source: GraceDillon, Walking the Clouds 2012. Not one homogeneous aesthetic; community authority, attribution and consent matter. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.topic,
      {
        "structured-data":
          'RDFa annotates document markup; JSON-LD embeds linked-data JSON, commonly in script[type="application/ld+json"]. Choose based on consumer requirements; no universal head-only mandate.',
      },
      "topic",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { topic: "structured-data" },
  output: {
    result: {
      reference:
        'RDFa annotates document markup; JSON-LD embeds linked-data JSON, commonly in script[type="application/ld+json"]. Choose based on consumer requirements; no universal head-only mandate.',
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/rdfa-vs-jsonld-head-recommendation",
  title: "RDFa vs JSON-LD Head Recommendation",
  description:
    "Bounded HTML feature/convention note; no full document audit or live browser compatibility determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      limitation:
        "Common hookworm egg size and morphology overlap between species; species attribution requires additional independently validated evidence.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "limitation" },
  output: {
    result: {
      reference:
        "Common hookworm egg size and morphology overlap between species; species attribution requires additional independently validated evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/hookworm-egg-ambiguity-flag-generator",
  title: "Hookworm Egg Species Size Overlap Ambiguity Warning Flag Generator",
  description:
    "Preserve hookworm egg species ambiguity rather than invent a size discriminator. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  exactLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    reference: exactLookup(i.key, {
      limitation:
        "Observed recombination fraction is at most 0.5 in the standard two-locus model. Map distance can exceed 50 cM because multiple crossovers are hidden; 50 cM is not a universal maximum map length.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "limitation" },
  output: {
    result: {
      reference:
        "Observed recombination fraction is at most 0.5 in the standard two-locus model. Map distance can exceed 50 cM because multiple crossovers are hidden; 50 cM is not a universal maximum map length.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/maxmap-50cm-limit-note-generator",
  title: "Max Map Distance 50 cM Unlinked Limit Note Generator",
  description:
    "Correct the misleading maximum-50-cM milestone premise. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

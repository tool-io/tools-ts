import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ category: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "category", label: "Category", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.category.length === 1);
  return H.finish({
    valid: ["U", "J", "Z"].includes(i.category),
    meaning:
      (
        {
          U: "freight-container",
          J: "detachable-equipment",
          Z: "trailer-or-chassis",
        } as Record<string, string>
      )[i.category] ?? "unrecognized",
  });
};
export const example = {
  input: { category: "U" },
  output: { result: { valid: true, meaning: "freight-container" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/iso6346-category-character-check",
  title: "Validation: Iso6346 Category Character Check Tool",
  description:
    "Inspect one ISO6346 equipment-category letter U/J/Z, not an owner code, check digit or operational container certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { meaning: { type: "string" }, valid: { type: "boolean" } },
        required: ["meaning", "valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

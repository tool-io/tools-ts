import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disclosureId: string;
  readonly category: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disclosureId: { type: "string", maxLength: 8192 },
    category: {
      type: "string",
      maxLength: 8192,
      enum: [
        "financial",
        "personal",
        "professional",
        "institutional",
        "other",
        "none-declared",
      ],
    },
  },
  required: ["disclosureId", "category"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label a declared conflict category without inferring undisclosed conflicts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disclosureId, category } = request;
  const compute = (): Output => {
    H.domain(disclosureId.length > 0, "disclosureId");
    H.domain(
      [
        "financial",
        "personal",
        "professional",
        "institutional",
        "other",
        "none-declared",
      ].includes(category),
      "category",
    );
    return { tag: disclosureId + " [" + category + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disclosureId: "D-12", category: "financial" },
  output: { tag: "D-12 [financial]" },
} satisfies ToolExample<Input, Output>;
export const disclosureConflictCategoryTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/disclosure-conflict-category-tag",
    title: "Disclosure Conflict Category Tag Tool",
    description:
      "Label a declared conflict category without inferring undisclosed conflicts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disclosureId: { type: "string", maxLength: 8192 },
        category: {
          type: "string",
          maxLength: 8192,
          enum: [
            "financial",
            "personal",
            "professional",
            "institutional",
            "other",
            "none-declared",
          ],
        },
      },
      required: ["disclosureId", "category"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "disclosureId",
          label: "Disclosure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "category",
          label: "Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = disclosureConflictCategoryTagTool.execute;
export default disclosureConflictCategoryTagTool;

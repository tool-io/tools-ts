import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly menuItemCode: string;
  readonly recordedAllergenCodes: readonly string[];
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    menuItemCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedAllergenCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["menuItemCode", "recordedAllergenCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Render explicitly recorded menu allergen codes without inferring ingredients, cross-contact or absence of allergens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { menuItemCode, recordedAllergenCodes } = request;
  const compute = (): Output => {
    H.domain(
      menuItemCode.length > 0 &&
        recordedAllergenCodes.every((v) => v.length > 0),
      "menuItemCode",
    );
    return {
      tag:
        menuItemCode +
        "; recorded allergens=" +
        JSON.stringify([...new Set(recordedAllergenCodes)]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    menuItemCode: "M17",
    recordedAllergenCodes: ["milk", "egg", "milk"],
  },
  output: { tag: 'M17; recorded allergens=["milk","egg"]' },
} satisfies ToolExample<Input, Output>;
export const menuAllergenTagFromRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/menu-allergen-tag-from-record",
    title: "Menu Allergen Tag From Record",
    description:
      "Render explicitly recorded menu allergen codes without inferring ingredients, cross-contact or absence of allergens.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        menuItemCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedAllergenCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["menuItemCode", "recordedAllergenCodes"],
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
          id: "menuItemCode",
          label: "Menu Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedAllergenCodes",
          label: "Recorded Allergen Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = menuAllergenTagFromRecordTool.execute;
export default menuAllergenTagFromRecordTool;

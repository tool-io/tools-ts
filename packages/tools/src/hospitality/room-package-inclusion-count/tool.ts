import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredItems: readonly string[];
  readonly includedItems: readonly string[];
};
export type Output = {
  readonly includedRequired: number;
  readonly missingRequired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredItems: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    includedItems: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredItems", "includedItems"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedRequired: { type: "integer" },
    missingRequired: { type: "integer" },
  },
  required: ["includedRequired", "missingRequired"],
} as const;
/** Calculate room package inclusion count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredItems, includedItems } = request;
  const compute = (): Output => {
    return {
      includedRequired: new Set(
        requiredItems.filter((x) => includedItems.includes(x)),
      ).size,
      missingRequired: new Set(
        requiredItems.filter((x) => !includedItems.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredItems: ["breakfast", "parking"],
    includedItems: ["breakfast"],
  },
  output: { includedRequired: 1, missingRequired: 1 },
} satisfies ToolExample<Input, Output>;
export const roomPackageInclusionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/room-package-inclusion-count",
    title: "Room Package Inclusion Count Tool",
    description:
      "Calculate room package inclusion count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredItems: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        includedItems: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredItems", "includedItems"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedRequired: { type: "integer" },
        missingRequired: { type: "integer" },
      },
      required: ["includedRequired", "missingRequired"],
    },
    ports: {
      inputs: [
        {
          id: "requiredItems",
          label: "Required Items",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "includedItems",
          label: "Included Items",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "includedRequired",
          label: "Included Required",
          valueType: { type: "integer" },
        },
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = roomPackageInclusionCountTool.execute;
export default roomPackageInclusionCountTool;

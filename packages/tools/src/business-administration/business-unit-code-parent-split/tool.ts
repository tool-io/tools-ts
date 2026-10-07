import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly unitCode: string; readonly separator: string };
export type Output = {
  readonly parentCode: string;
  readonly leafCode: string;
  readonly hasParent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitCode: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["unitCode", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentCode: { type: "string", maxLength: 8192 },
    leafCode: { type: "string", maxLength: 8192 },
    hasParent: { type: "boolean" },
  },
  required: ["parentCode", "leafCode", "hasParent"],
} as const;
/** Split a hierarchical business-unit code at its final explicit separator without inferring an organizational structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitCode, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0 && unitCode.length > 0, "separator");
    const parts = unitCode.split(separator);
    H.domain(
      parts.every((v) => v.length > 0),
      "unitCode",
    );
    return {
      parentCode: parts.slice(0, -1).join(separator),
      leafCode: parts[parts.length - 1],
      hasParent: parts.length > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitCode: "ORG/FIN/AP", separator: "/" },
  output: { parentCode: "ORG/FIN", leafCode: "AP", hasParent: true },
} satisfies ToolExample<Input, Output>;
export const businessUnitCodeParentSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/business-unit-code-parent-split",
    title: "Business Unit Code Parent Split",
    description:
      "Split a hierarchical business-unit code at its final explicit separator without inferring an organizational structure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitCode: { type: "string", maxLength: 8192, minLength: 1 },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["unitCode", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentCode: { type: "string", maxLength: 8192 },
        leafCode: { type: "string", maxLength: 8192 },
        hasParent: { type: "boolean" },
      },
      required: ["parentCode", "leafCode", "hasParent"],
    },
    ports: {
      inputs: [
        {
          id: "unitCode",
          label: "Unit Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "parentCode",
          label: "Parent Code",
          valueType: { type: "string" },
        },
        { id: "leafCode", label: "Leaf Code", valueType: { type: "string" } },
        {
          id: "hasParent",
          label: "Has Parent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = businessUnitCodeParentSplitTool.execute;
export default businessUnitCodeParentSplitTool;

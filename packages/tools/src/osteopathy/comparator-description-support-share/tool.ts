import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly descriptionElements: readonly string[];
  readonly suppliedElements: readonly string[];
  readonly applicableElements: readonly string[];
};
export type Output = {
  readonly applicable: number;
  readonly supported: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    descriptionElements: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedElements: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    applicableElements: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["descriptionElements", "suppliedElements", "applicableElements"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicable: { type: "integer" },
    supported: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["applicable", "supported", "share", "defined"],
} as const;
/** Count explicitly applicable comparator-description elements; no effectiveness or treatment claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { descriptionElements, suppliedElements, applicableElements } = request;
  const compute = (): Output => {
    return (() => {
      const req = [...new Set(descriptionElements)].filter((x) =>
          applicableElements.includes(x),
        ),
        supported = req.filter((x) => suppliedElements.includes(x)).length;
      return {
        applicable: req.length,
        supported,
        share: req.length ? supported / req.length : 0,
        defined: req.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    descriptionElements: ["dose", "time", "setting"],
    suppliedElements: ["dose"],
    applicableElements: ["dose", "time"],
  },
  output: { applicable: 2, supported: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const comparatorDescriptionSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/comparator-description-support-share",
    title: "Comparator Description Support Share Tool",
    description:
      "Count explicitly applicable comparator-description elements; no effectiveness or treatment claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        descriptionElements: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedElements: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        applicableElements: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "descriptionElements",
        "suppliedElements",
        "applicableElements",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicable: { type: "integer" },
        supported: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["applicable", "supported", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "descriptionElements",
          label: "Description Elements",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedElements",
          label: "Supplied Elements",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "applicableElements",
          label: "Applicable Elements",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "applicable",
          label: "Applicable",
          valueType: { type: "integer" },
        },
        { id: "supported", label: "Supported", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = comparatorDescriptionSupportShareTool.execute;
export default comparatorDescriptionSupportShareTool;

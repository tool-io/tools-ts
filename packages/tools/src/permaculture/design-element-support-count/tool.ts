import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly element: string;
  readonly elementIds: readonly string[];
  readonly supportingSources: readonly string[];
};
export type Output = {
  readonly supportRows: number;
  readonly distinctSources: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    element: { type: "string", maxLength: 8192 },
    elementIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supportingSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["element", "elementIds", "supportingSources"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportRows: { type: "integer" },
    distinctSources: { type: "integer" },
  },
  required: ["supportRows", "distinctSources"],
} as const;
/** Count explicit design evidence links without claiming ecological effectiveness or source independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { element, elementIds, supportingSources } = request;
  const compute = (): Output => {
    H.sameLength(elementIds, supportingSources);
    return {
      supportRows: elementIds.filter((x) => x === element).length,
      distinctSources: new Set(
        supportingSources.filter((x, i) => elementIds[i] === element),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    element: "A",
    elementIds: ["A", "B", "A"],
    supportingSources: ["s1", "s2", "s1"],
  },
  output: { supportRows: 2, distinctSources: 1 },
} satisfies ToolExample<Input, Output>;
export const designElementSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/design-element-support-count",
    title: "Design Element Support Count Tool",
    description:
      "Count explicit design evidence links without claiming ecological effectiveness or source independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        element: { type: "string", maxLength: 8192 },
        elementIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supportingSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["element", "elementIds", "supportingSources"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportRows: { type: "integer" },
        distinctSources: { type: "integer" },
      },
      required: ["supportRows", "distinctSources"],
    },
    ports: {
      inputs: [
        {
          id: "element",
          label: "Element",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementIds",
          label: "Element Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supportingSources",
          label: "Supporting Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "supportRows",
          label: "Support Rows",
          valueType: { type: "integer" },
        },
        {
          id: "distinctSources",
          label: "Distinct Sources",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = designElementSupportCountTool.execute;
export default designElementSupportCountTool;

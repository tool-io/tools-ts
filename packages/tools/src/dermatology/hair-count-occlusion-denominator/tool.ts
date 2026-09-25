import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly fieldArea: number;
  readonly occludedArea: number;
  readonly excludeOccluded: boolean;
};
export type Output = { readonly denominator: number; readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    fieldArea: { type: "number" },
    occludedArea: { type: "number", minimum: 0 },
    excludeOccluded: { type: "boolean" },
  },
  required: ["count", "fieldArea", "occludedArea", "excludeOccluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" }, density: { type: "number" } },
  required: ["denominator", "density"],
} as const;
/** Research image count per explicitly included area, without interpreting hair density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, fieldArea, occludedArea, excludeOccluded } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.domain(fieldArea > occludedArea && occludedArea >= 0);
    return {
      denominator: fieldArea - (excludeOccluded ? occludedArea : 0),
      density: count / (fieldArea - (excludeOccluded ? occludedArea : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 40, fieldArea: 10, occludedArea: 2, excludeOccluded: true },
  output: { denominator: 8, density: 5 },
} satisfies ToolExample<Input, Output>;
export const hairCountOcclusionDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/hair-count-occlusion-denominator",
    title: "Hair Count Occlusion Denominator Tool",
    description:
      "Research image count per explicitly included area, without interpreting hair density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        fieldArea: { type: "number" },
        occludedArea: { type: "number", minimum: 0 },
        excludeOccluded: { type: "boolean" },
      },
      required: ["count", "fieldArea", "occludedArea", "excludeOccluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        density: { type: "number" },
      },
      required: ["denominator", "density"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fieldArea",
          label: "Field Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occludedArea",
          label: "Occluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeOccluded",
          label: "Exclude Occluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hairCountOcclusionDenominatorTool.execute;
export default hairCountOcclusionDenominatorTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rent: number;
  readonly grossArea: number;
  readonly excludedArea: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly areaBase: number;
  readonly rentPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rent: { type: "number" },
    grossArea: { type: "number", exclusiveMinimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["rent", "grossArea", "excludedArea", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaBase: { type: "number" }, rentPerArea: { type: "number" } },
  required: ["areaBase", "rentPerArea"],
} as const;
/** Compute supplied rent per explicitly selected gross/net area without a measurement-standard or valuation determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rent, grossArea, excludedArea, excludeMarked } = request;
  const compute = (): Output => {
    H.positive(grossArea);
    H.domain(excludedArea >= 0 && excludedArea < grossArea);
    return {
      areaBase: grossArea - (excludeMarked ? excludedArea : 0),
      rentPerArea: rent / (grossArea - (excludeMarked ? excludedArea : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rent: 1000, grossArea: 100, excludedArea: 20, excludeMarked: true },
  output: { areaBase: 80, rentPerArea: 12.5 },
} satisfies ToolExample<Input, Output>;
export const effectiveAreaRentScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/effective-area-rent-scalar",
    title: "Effective Area Rent Scalar Tool",
    description:
      "Compute supplied rent per explicitly selected gross/net area without a measurement-standard or valuation determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rent: { type: "number" },
        grossArea: { type: "number", exclusiveMinimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: ["rent", "grossArea", "excludedArea", "excludeMarked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaBase: { type: "number" },
        rentPerArea: { type: "number" },
      },
      required: ["areaBase", "rentPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "rent",
          label: "Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "areaBase", label: "Area Base", valueType: { type: "number" } },
        {
          id: "rentPerArea",
          label: "Rent Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = effectiveAreaRentScalarTool.execute;
export default effectiveAreaRentScalarTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly measuredArea: number;
  readonly suppliedAreaToSquareMeters: number;
};
export type Output = {
  readonly areaSquareMeters: number;
  readonly loading: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    measuredArea: { type: "number", exclusiveMinimum: 0 },
    suppliedAreaToSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "measuredArea", "suppliedAreaToSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaSquareMeters: { type: "number" },
    loading: { type: "number" },
  },
  required: ["areaSquareMeters", "loading"],
} as const;
/** Convert an explicitly defined wing-area basis before computing force per square meter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, measuredArea, suppliedAreaToSquareMeters } = request;
  const compute = (): Output => {
    H.domain(force >= 0);
    H.positive(measuredArea);
    H.positive(suppliedAreaToSquareMeters);
    return {
      areaSquareMeters: measuredArea * suppliedAreaToSquareMeters,
      loading: force / (measuredArea * suppliedAreaToSquareMeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 20, measuredArea: 4000, suppliedAreaToSquareMeters: 0.0001 },
  output: { areaSquareMeters: 0.4, loading: 50 },
} satisfies ToolExample<Input, Output>;
export const wingLoadAreaUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/wing-load-area-unit-factor",
    title: "Wing Load Area Unit Factor Tool",
    description:
      "Convert an explicitly defined wing-area basis before computing force per square meter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        measuredArea: { type: "number", exclusiveMinimum: 0 },
        suppliedAreaToSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "measuredArea", "suppliedAreaToSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaSquareMeters: { type: "number" },
        loading: { type: "number" },
      },
      required: ["areaSquareMeters", "loading"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredArea",
          label: "Measured Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAreaToSquareMeters",
          label: "Supplied Area To Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaSquareMeters",
          label: "Area Square Meters",
          valueType: { type: "number" },
        },
        { id: "loading", label: "Loading", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wingLoadAreaUnitFactorTool.execute;
export default wingLoadAreaUnitFactorTool;

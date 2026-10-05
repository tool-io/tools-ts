import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominal: number;
  readonly measured: number;
  readonly lowerTolerance: number;
  readonly upperTolerance: number;
};
export type Output = {
  readonly deviation: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominal: { type: "number" },
    measured: { type: "number" },
    lowerTolerance: { type: "number", minimum: 0 },
    upperTolerance: { type: "number", minimum: 0 },
  },
  required: ["nominal", "measured", "lowerTolerance", "upperTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviation: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["deviation", "withinTolerance"],
} as const;
/** Check one garment specification measurement against explicitly supplied asymmetric inclusive tolerances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominal, measured, lowerTolerance, upperTolerance } = request;
  const compute = (): Output => {
    H.domain(lowerTolerance >= 0 && upperTolerance >= 0, "lowerTolerance");
    return {
      deviation: measured - nominal,
      withinTolerance:
        measured >= nominal - lowerTolerance &&
        measured <= nominal + upperTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominal: 100, measured: 102, lowerTolerance: 1, upperTolerance: 2 },
  output: { deviation: 2, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const garmentSizeSpecSingleToleranceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/garment-size-spec-single-tolerance",
    title: "Garment Size Spec Single Tolerance Tool",
    description:
      "Check one garment specification measurement against explicitly supplied asymmetric inclusive tolerances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominal: { type: "number" },
        measured: { type: "number" },
        lowerTolerance: { type: "number", minimum: 0 },
        upperTolerance: { type: "number", minimum: 0 },
      },
      required: ["nominal", "measured", "lowerTolerance", "upperTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviation: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["deviation", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "nominal",
          label: "Nominal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerTolerance",
          label: "Lower Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperTolerance",
          label: "Upper Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deviation", label: "Deviation", valueType: { type: "number" } },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = garmentSizeSpecSingleToleranceTool.execute;
export default garmentSizeSpecSingleToleranceTool;

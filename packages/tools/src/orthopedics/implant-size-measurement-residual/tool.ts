import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredSize: number;
  readonly labeledSize: number;
  readonly suppliedUnitFactor: number;
  readonly tolerance: number;
};
export type Output = {
  readonly convertedSize: number;
  readonly residual: number;
  readonly insideSuppliedTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredSize: { type: "number" },
    labeledSize: { type: "number" },
    suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["measuredSize", "labeledSize", "suppliedUnitFactor", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedSize: { type: "number" },
    residual: { type: "number" },
    insideSuppliedTolerance: { type: "boolean" },
  },
  required: ["convertedSize", "residual", "insideSuppliedTolerance"],
} as const;
/** Supplied bench nominal-size comparison without implant selection or clinical suitability advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredSize, labeledSize, suppliedUnitFactor, tolerance } = request;
  const compute = (): Output => {
    H.positive(suppliedUnitFactor);
    H.domain(tolerance >= 0);
    return {
      convertedSize: measuredSize * suppliedUnitFactor,
      residual: measuredSize * suppliedUnitFactor - labeledSize,
      insideSuppliedTolerance:
        Math.abs(measuredSize * suppliedUnitFactor - labeledSize) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredSize: 12,
    labeledSize: 10,
    suppliedUnitFactor: 1,
    tolerance: 1,
  },
  output: { convertedSize: 12, residual: 2, insideSuppliedTolerance: false },
} satisfies ToolExample<Input, Output>;
export const implantSizeMeasurementResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/implant-size-measurement-residual",
    title: "Implant Size Measurement Residual Tool",
    description:
      "Supplied bench nominal-size comparison without implant selection or clinical suitability advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredSize: { type: "number" },
        labeledSize: { type: "number" },
        suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: [
        "measuredSize",
        "labeledSize",
        "suppliedUnitFactor",
        "tolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedSize: { type: "number" },
        residual: { type: "number" },
        insideSuppliedTolerance: { type: "boolean" },
      },
      required: ["convertedSize", "residual", "insideSuppliedTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "measuredSize",
          label: "Measured Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labeledSize",
          label: "Labeled Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUnitFactor",
          label: "Supplied Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedSize",
          label: "Converted Size",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "insideSuppliedTolerance",
          label: "Inside Supplied Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = implantSizeMeasurementResidualTool.execute;
export default implantSizeMeasurementResidualTool;

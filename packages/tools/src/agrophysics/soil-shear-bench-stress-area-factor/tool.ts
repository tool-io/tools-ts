import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly width: number;
  readonly length: number;
  readonly displacedLength: number;
};
export type Output = {
  readonly overlapArea: number;
  readonly shearStress: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    width: { type: "number", exclusiveMinimum: 0 },
    length: { type: "number" },
    displacedLength: { type: "number", minimum: 0 },
  },
  required: ["force", "width", "length", "displacedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapArea: { type: "number" },
    shearStress: { type: "number" },
  },
  required: ["overlapArea", "shearStress"],
} as const;
/** Calculate soil shear bench stress area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, width, length, displacedLength } = request;
  const compute = (): Output => {
    H.positive(width);
    H.domain(length > displacedLength && displacedLength >= 0);
    return {
      overlapArea: width * (length - displacedLength),
      shearStress: force / (width * (length - displacedLength)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 100, width: 2, length: 5, displacedLength: 1 },
  output: { overlapArea: 8, shearStress: 12.5 },
} satisfies ToolExample<Input, Output>;
export const soilShearBenchStressAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-shear-bench-stress-area-factor",
    title: "Soil Shear Bench Stress Area Factor Tool",
    description:
      "Calculate soil shear bench stress area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        width: { type: "number", exclusiveMinimum: 0 },
        length: { type: "number" },
        displacedLength: { type: "number", minimum: 0 },
      },
      required: ["force", "width", "length", "displacedLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapArea: { type: "number" },
        shearStress: { type: "number" },
      },
      required: ["overlapArea", "shearStress"],
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
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacedLength",
          label: "Displaced Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapArea",
          label: "Overlap Area",
          valueType: { type: "number" },
        },
        {
          id: "shearStress",
          label: "Shear Stress",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilShearBenchStressAreaFactorTool.execute;
export default soilShearBenchStressAreaFactorTool;

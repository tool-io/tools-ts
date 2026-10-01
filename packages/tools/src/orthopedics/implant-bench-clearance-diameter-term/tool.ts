import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boreDiameter: number;
  readonly shaftDiameter: number;
  readonly boreTolerance: number;
  readonly shaftTolerance: number;
};
export type Output = {
  readonly nominalDiametralClearance: number;
  readonly minimumClearance: number;
  readonly maximumClearance: number;
  readonly nominalRadialClearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boreDiameter: { type: "number", minimum: 0 },
    shaftDiameter: { type: "number", minimum: 0 },
    boreTolerance: { type: "number", minimum: 0 },
    shaftTolerance: { type: "number", minimum: 0 },
  },
  required: [
    "boreDiameter",
    "shaftDiameter",
    "boreTolerance",
    "shaftTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDiametralClearance: { type: "number" },
    minimumClearance: { type: "number" },
    maximumClearance: { type: "number" },
    nominalRadialClearance: { type: "number" },
  },
  required: [
    "nominalDiametralClearance",
    "minimumClearance",
    "maximumClearance",
    "nominalRadialClearance",
  ],
} as const;
/** Bench concentric-diameter tolerance envelope; no implant fit, load capacity or surgical recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boreDiameter, shaftDiameter, boreTolerance, shaftTolerance } =
    request;
  const compute = (): Output => {
    H.domain(
      boreDiameter >= 0 &&
        shaftDiameter >= 0 &&
        boreTolerance >= 0 &&
        shaftTolerance >= 0,
    );
    return {
      nominalDiametralClearance: boreDiameter - shaftDiameter,
      minimumClearance:
        boreDiameter - shaftDiameter - boreTolerance - shaftTolerance,
      maximumClearance:
        boreDiameter - shaftDiameter + boreTolerance + shaftTolerance,
      nominalRadialClearance: (boreDiameter - shaftDiameter) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    boreDiameter: 10,
    shaftDiameter: 9.8,
    boreTolerance: 0.05,
    shaftTolerance: 0.05,
  },
  output: {
    nominalDiametralClearance: 0.1999999999999993,
    minimumClearance: 0.0999999999999993,
    maximumClearance: 0.29999999999999927,
    nominalRadialClearance: 0.09999999999999964,
  },
} satisfies ToolExample<Input, Output>;
export const implantBenchClearanceDiameterTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/implant-bench-clearance-diameter-term",
    title: "Implant Bench Clearance Diameter Term Tool",
    description:
      "Bench concentric-diameter tolerance envelope; no implant fit, load capacity or surgical recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boreDiameter: { type: "number", minimum: 0 },
        shaftDiameter: { type: "number", minimum: 0 },
        boreTolerance: { type: "number", minimum: 0 },
        shaftTolerance: { type: "number", minimum: 0 },
      },
      required: [
        "boreDiameter",
        "shaftDiameter",
        "boreTolerance",
        "shaftTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDiametralClearance: { type: "number" },
        minimumClearance: { type: "number" },
        maximumClearance: { type: "number" },
        nominalRadialClearance: { type: "number" },
      },
      required: [
        "nominalDiametralClearance",
        "minimumClearance",
        "maximumClearance",
        "nominalRadialClearance",
      ],
    },
    ports: {
      inputs: [
        {
          id: "boreDiameter",
          label: "Bore Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shaftDiameter",
          label: "Shaft Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boreTolerance",
          label: "Bore Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shaftTolerance",
          label: "Shaft Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalDiametralClearance",
          label: "Nominal Diametral Clearance",
          valueType: { type: "number" },
        },
        {
          id: "minimumClearance",
          label: "Minimum Clearance",
          valueType: { type: "number" },
        },
        {
          id: "maximumClearance",
          label: "Maximum Clearance",
          valueType: { type: "number" },
        },
        {
          id: "nominalRadialClearance",
          label: "Nominal Radial Clearance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implantBenchClearanceDiameterTermTool.execute;
export default implantBenchClearanceDiameterTermTool;

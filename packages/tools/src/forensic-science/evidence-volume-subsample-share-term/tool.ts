import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalVolume: number;
  readonly subsampleVolume: number;
  readonly measuredMass: number;
  readonly homogeneous: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly extrapolatedMass: number;
  readonly assumptionAffirmed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number", exclusiveMinimum: 0 },
    subsampleVolume: { type: "number", exclusiveMinimum: 0 },
    measuredMass: { type: "number", minimum: 0 },
    homogeneous: { type: "boolean" },
  },
  required: ["totalVolume", "subsampleVolume", "measuredMass", "homogeneous"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    extrapolatedMass: { type: "number" },
    assumptionAffirmed: { type: "boolean" },
  },
  required: ["fraction", "extrapolatedMass", "assumptionAffirmed"],
} as const;
/** Homogeneity-based mass expansion with an explicit assumption flag, without a forensic sampling sufficiency claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalVolume, subsampleVolume, measuredMass, homogeneous } = request;
  const compute = (): Output => {
    H.positive(totalVolume);
    H.positive(subsampleVolume);
    H.domain(subsampleVolume <= totalVolume && measuredMass >= 0);
    return {
      fraction: subsampleVolume / totalVolume,
      extrapolatedMass: (measuredMass * totalVolume) / subsampleVolume,
      assumptionAffirmed: homogeneous,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalVolume: 100,
    subsampleVolume: 5,
    measuredMass: 2,
    homogeneous: true,
  },
  output: { fraction: 0.05, extrapolatedMass: 40, assumptionAffirmed: true },
} satisfies ToolExample<Input, Output>;
export const evidenceVolumeSubsampleShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-volume-subsample-share-term",
    title: "Evidence Volume Subsample Share Term Tool",
    description:
      "Homogeneity-based mass expansion with an explicit assumption flag, without a forensic sampling sufficiency claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number", exclusiveMinimum: 0 },
        subsampleVolume: { type: "number", exclusiveMinimum: 0 },
        measuredMass: { type: "number", minimum: 0 },
        homogeneous: { type: "boolean" },
      },
      required: [
        "totalVolume",
        "subsampleVolume",
        "measuredMass",
        "homogeneous",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        extrapolatedMass: { type: "number" },
        assumptionAffirmed: { type: "boolean" },
      },
      required: ["fraction", "extrapolatedMass", "assumptionAffirmed"],
    },
    ports: {
      inputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subsampleVolume",
          label: "Subsample Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredMass",
          label: "Measured Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "homogeneous",
          label: "Homogeneous",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "extrapolatedMass",
          label: "Extrapolated Mass",
          valueType: { type: "number" },
        },
        {
          id: "assumptionAffirmed",
          label: "Assumption Affirmed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceVolumeSubsampleShareTermTool.execute;
export default evidenceVolumeSubsampleShareTermTool;

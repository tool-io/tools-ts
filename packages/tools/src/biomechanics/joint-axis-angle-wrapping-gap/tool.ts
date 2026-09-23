import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly referenceDegrees: number;
  readonly periodDegrees: number;
};
export type Output = {
  readonly signedWrappedGap: number;
  readonly antipodal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    referenceDegrees: { type: "number" },
    periodDegrees: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["angleDegrees", "referenceDegrees", "periodDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedWrappedGap: { type: "number" },
    antipodal: { type: "boolean" },
  },
  required: ["signedWrappedGap", "antipodal"],
} as const;
/** Wrap an explicit research-axis difference with positive antipodal tie convention, not a clinical range of motion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, referenceDegrees, periodDegrees } = request;
  const compute = (): Output => {
    H.positive(periodDegrees);
    return (() => {
      const raw =
          ((angleDegrees % periodDegrees) -
            (referenceDegrees % periodDegrees)) %
          periodDegrees,
        positive = raw < 0 ? raw + periodDegrees : raw,
        d = positive > periodDegrees / 2 ? positive - periodDegrees : positive;
      return {
        signedWrappedGap: d,
        antipodal: positive > 0 && positive === periodDegrees / 2,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: 350, referenceDegrees: 10, periodDegrees: 360 },
  output: { signedWrappedGap: -20, antipodal: false },
} satisfies ToolExample<Input, Output>;
export const jointAxisAngleWrappingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/joint-axis-angle-wrapping-gap",
    title: "Joint Axis Angle Wrapping Gap Tool",
    description:
      "Wrap an explicit research-axis difference with positive antipodal tie convention, not a clinical range of motion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        referenceDegrees: { type: "number" },
        periodDegrees: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["angleDegrees", "referenceDegrees", "periodDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedWrappedGap: { type: "number" },
        antipodal: { type: "boolean" },
      },
      required: ["signedWrappedGap", "antipodal"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDegrees",
          label: "Reference Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodDegrees",
          label: "Period Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedWrappedGap",
          label: "Signed Wrapped Gap",
          valueType: { type: "number" },
        },
        { id: "antipodal", label: "Antipodal", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jointAxisAngleWrappingGapTool.execute;
export default jointAxisAngleWrappingGapTool;

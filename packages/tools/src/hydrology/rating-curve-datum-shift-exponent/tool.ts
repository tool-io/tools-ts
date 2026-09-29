import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stage: number;
  readonly zeroFlowStage: number;
  readonly coefficient: number;
  readonly exponent: number;
};
export type Output = {
  readonly flow: number;
  readonly stageSensitivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stage: { type: "number" },
    zeroFlowStage: { type: "number" },
    coefficient: { type: "number", minimum: 0 },
    exponent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stage", "zeroFlowStage", "coefficient", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    stageSensitivity: { type: "number" },
  },
  required: ["flow", "stageSensitivity"],
} as const;
/** Calculate rating curve datum shift exponent from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stage, zeroFlowStage, coefficient, exponent } = request;
  const compute = (): Output => {
    H.domain(stage > zeroFlowStage && coefficient >= 0);
    H.positive(exponent);
    return {
      flow: coefficient * (stage - zeroFlowStage) ** exponent,
      stageSensitivity:
        coefficient * exponent * (stage - zeroFlowStage) ** (exponent - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stage: 5, zeroFlowStage: 1, coefficient: 2, exponent: 1.5 },
  output: { flow: 16, stageSensitivity: 6 },
} satisfies ToolExample<Input, Output>;
export const ratingCurveDatumShiftExponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rating-curve-datum-shift-exponent",
    title: "Rating Curve Datum Shift Exponent Tool",
    description:
      "Calculate rating curve datum shift exponent from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stage: { type: "number" },
        zeroFlowStage: { type: "number" },
        coefficient: { type: "number", minimum: 0 },
        exponent: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["stage", "zeroFlowStage", "coefficient", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number" },
        stageSensitivity: { type: "number" },
      },
      required: ["flow", "stageSensitivity"],
    },
    ports: {
      inputs: [
        {
          id: "stage",
          label: "Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroFlowStage",
          label: "Zero Flow Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "flow", label: "Flow", valueType: { type: "number" } },
        {
          id: "stageSensitivity",
          label: "Stage Sensitivity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratingCurveDatumShiftExponentTool.execute;
export default ratingCurveDatumShiftExponentTool;

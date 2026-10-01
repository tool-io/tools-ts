import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReading: number;
  readonly secondReading: number;
  readonly suppliedScale: number;
  readonly reverseAxis: boolean;
};
export type Output = {
  readonly signedDifference: number;
  readonly absoluteDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReading: { type: "number" },
    secondReading: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    reverseAxis: { type: "boolean" },
  },
  required: ["firstReading", "secondReading", "suppliedScale", "reverseAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDifference: { type: "number" },
    absoluteDifference: { type: "number" },
  },
  required: ["signedDifference", "absoluteDifference"],
} as const;
/** Compare supplied repeated bench landmark readings without diagnostic or efficacy interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstReading, secondReading, suppliedScale, reverseAxis } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      signedDifference:
        (secondReading - firstReading) * suppliedScale * (reverseAxis ? -1 : 1),
      absoluteDifference:
        Math.abs(secondReading - firstReading) * suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReading: 10,
    secondReading: 12,
    suppliedScale: 0.5,
    reverseAxis: false,
  },
  output: { signedDifference: 1, absoluteDifference: 1 },
} satisfies ToolExample<Input, Output>;
export const researchLandmarkRepeatDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/research-landmark-repeat-difference",
    title: "Research Landmark Repeat Difference Tool",
    description:
      "Compare supplied repeated bench landmark readings without diagnostic or efficacy interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstReading: { type: "number" },
        secondReading: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        reverseAxis: { type: "boolean" },
      },
      required: [
        "firstReading",
        "secondReading",
        "suppliedScale",
        "reverseAxis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDifference: { type: "number" },
        absoluteDifference: { type: "number" },
      },
      required: ["signedDifference", "absoluteDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstReading",
          label: "First Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReading",
          label: "Second Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "number" },
        },
        {
          id: "absoluteDifference",
          label: "Absolute Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchLandmarkRepeatDifferenceTool.execute;
export default researchLandmarkRepeatDifferenceTool;

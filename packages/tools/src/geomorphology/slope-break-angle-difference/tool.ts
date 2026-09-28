import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRisePerRun: number;
  readonly secondRisePerRun: number;
};
export type Output = {
  readonly signedAngleRadians: number;
  readonly absoluteAngleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRisePerRun: { type: "number" },
    secondRisePerRun: { type: "number" },
  },
  required: ["firstRisePerRun", "secondRisePerRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedAngleRadians: { type: "number" },
    absoluteAngleRadians: { type: "number" },
  },
  required: ["signedAngleRadians", "absoluteAngleRadians"],
} as const;
/** Compare two supplied directed slope angles without a geomorphic process classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRisePerRun, secondRisePerRun } = request;
  const compute = (): Output => {
    return {
      signedAngleRadians:
        Math.atan(secondRisePerRun) - Math.atan(firstRisePerRun),
      absoluteAngleRadians: Math.abs(
        Math.atan(secondRisePerRun) - Math.atan(firstRisePerRun),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRisePerRun: 0, secondRisePerRun: 1 },
  output: {
    signedAngleRadians: 0.7853981633974483,
    absoluteAngleRadians: 0.7853981633974483,
  },
} satisfies ToolExample<Input, Output>;
export const slopeBreakAngleDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/slope-break-angle-difference",
    title: "Slope Break Angle Difference Tool",
    description:
      "Compare two supplied directed slope angles without a geomorphic process classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRisePerRun: { type: "number" },
        secondRisePerRun: { type: "number" },
      },
      required: ["firstRisePerRun", "secondRisePerRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedAngleRadians: { type: "number" },
        absoluteAngleRadians: { type: "number" },
      },
      required: ["signedAngleRadians", "absoluteAngleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "firstRisePerRun",
          label: "First Rise Per Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRisePerRun",
          label: "Second Rise Per Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedAngleRadians",
          label: "Signed Angle Radians",
          valueType: { type: "number" },
        },
        {
          id: "absoluteAngleRadians",
          label: "Absolute Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = slopeBreakAngleDifferenceTool.execute;
export default slopeBreakAngleDifferenceTool;

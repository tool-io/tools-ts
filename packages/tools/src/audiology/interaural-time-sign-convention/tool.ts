import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftTime: number;
  readonly rightTime: number;
  readonly positiveMeansRightLater: boolean;
};
export type Output = {
  readonly difference: number;
  readonly leftEarlier: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftTime: { type: "number" },
    rightTime: { type: "number" },
    positiveMeansRightLater: { type: "boolean" },
  },
  required: ["leftTime", "rightTime", "positiveMeansRightLater"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    leftEarlier: { type: "boolean" },
  },
  required: ["difference", "leftEarlier"],
} as const;
/** Relabel a supplied interaural timing difference without estimating localization or hearing status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftTime, rightTime, positiveMeansRightLater } = request;
  const compute = (): Output => {
    return {
      difference: (rightTime - leftTime) * (positiveMeansRightLater ? 1 : -1),
      leftEarlier: leftTime < rightTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftTime: 2, rightTime: 5, positiveMeansRightLater: true },
  output: { difference: 3, leftEarlier: true },
} satisfies ToolExample<Input, Output>;
export const interauralTimeSignConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/interaural-time-sign-convention",
    title: "Interaural Time Sign Convention Tool",
    description:
      "Relabel a supplied interaural timing difference without estimating localization or hearing status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftTime: { type: "number" },
        rightTime: { type: "number" },
        positiveMeansRightLater: { type: "boolean" },
      },
      required: ["leftTime", "rightTime", "positiveMeansRightLater"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        leftEarlier: { type: "boolean" },
      },
      required: ["difference", "leftEarlier"],
    },
    ports: {
      inputs: [
        {
          id: "leftTime",
          label: "Left Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightTime",
          label: "Right Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansRightLater",
          label: "Positive Means Right Later",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "leftEarlier",
          label: "Left Earlier",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = interauralTimeSignConventionTool.execute;
export default interauralTimeSignConventionTool;

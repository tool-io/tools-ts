import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly firstRadius: number;
  readonly secondRadius: number;
};
export type Output = {
  readonly externalSlack: number;
  readonly internalSlack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
  },
  required: ["distance", "firstRadius", "secondRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    externalSlack: { type: "number" },
    internalSlack: { type: "number" },
  },
  required: ["externalSlack", "internalSlack"],
} as const;
/** Calculate circle center distance tangency slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, firstRadius, secondRadius } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && firstRadius >= 0 && secondRadius >= 0);
    return {
      externalSlack: distance - firstRadius - secondRadius,
      internalSlack: distance - Math.abs(firstRadius - secondRadius),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 8, firstRadius: 3, secondRadius: 5 },
  output: { externalSlack: 0, internalSlack: 6 },
} satisfies ToolExample<Input, Output>;
export const circleCenterDistanceTangencySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/circle-center-distance-tangency-slack",
    title: "Circle Center Distance Tangency Slack Tool",
    description:
      "Calculate circle center distance tangency slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
      },
      required: ["distance", "firstRadius", "secondRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        externalSlack: { type: "number" },
        internalSlack: { type: "number" },
      },
      required: ["externalSlack", "internalSlack"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "externalSlack",
          label: "External Slack",
          valueType: { type: "number" },
        },
        {
          id: "internalSlack",
          label: "Internal Slack",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = circleCenterDistanceTangencySlackTool.execute;
export default circleCenterDistanceTangencySlackTool;

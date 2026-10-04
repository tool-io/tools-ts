import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerWidth: number;
  readonly upperWidth: number;
  readonly leftStepback: number;
  readonly rightStepback: number;
};
export type Output = {
  readonly availableUpperWidth: number;
  readonly widthGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerWidth: { type: "number", minimum: 0 },
    upperWidth: { type: "number", minimum: 0 },
    leftStepback: { type: "number", minimum: 0 },
    rightStepback: { type: "number", minimum: 0 },
  },
  required: ["lowerWidth", "upperWidth", "leftStepback", "rightStepback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableUpperWidth: { type: "number" },
    widthGap: { type: "number" },
  },
  required: ["availableUpperWidth", "widthGap"],
} as const;
/** Compare a supplied upper envelope with explicit two-sided stepbacks, without zoning rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerWidth, upperWidth, leftStepback, rightStepback } = request;
  const compute = (): Output => {
    H.domain(
      lowerWidth >= 0 &&
        upperWidth >= 0 &&
        leftStepback >= 0 &&
        rightStepback >= 0 &&
        leftStepback + rightStepback <= lowerWidth,
    );
    return {
      availableUpperWidth: lowerWidth - leftStepback - rightStepback,
      widthGap: lowerWidth - leftStepback - rightStepback - upperWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerWidth: 20, upperWidth: 12, leftStepback: 3, rightStepback: 4 },
  output: { availableUpperWidth: 13, widthGap: 1 },
} satisfies ToolExample<Input, Output>;
export const buildingStepbackWidthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/building-stepback-width-gap",
    title: "Building Stepback Width Gap Tool",
    description:
      "Compare a supplied upper envelope with explicit two-sided stepbacks, without zoning rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerWidth: { type: "number", minimum: 0 },
        upperWidth: { type: "number", minimum: 0 },
        leftStepback: { type: "number", minimum: 0 },
        rightStepback: { type: "number", minimum: 0 },
      },
      required: ["lowerWidth", "upperWidth", "leftStepback", "rightStepback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableUpperWidth: { type: "number" },
        widthGap: { type: "number" },
      },
      required: ["availableUpperWidth", "widthGap"],
    },
    ports: {
      inputs: [
        {
          id: "lowerWidth",
          label: "Lower Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperWidth",
          label: "Upper Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftStepback",
          label: "Left Stepback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightStepback",
          label: "Right Stepback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableUpperWidth",
          label: "Available Upper Width",
          valueType: { type: "number" },
        },
        { id: "widthGap", label: "Width Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = buildingStepbackWidthGapTool.execute;
export default buildingStepbackWidthGapTool;

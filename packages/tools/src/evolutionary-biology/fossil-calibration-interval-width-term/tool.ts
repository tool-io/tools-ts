import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minimumAge: number;
  readonly maximumAge: number;
  readonly nodeAge: number;
};
export type Output = {
  readonly width: number;
  readonly inside: boolean;
  readonly nearestBoundGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumAge: { type: "number", minimum: 0 },
    maximumAge: { type: "number" },
    nodeAge: { type: "number", minimum: 0 },
  },
  required: ["minimumAge", "maximumAge", "nodeAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    inside: { type: "boolean" },
    nearestBoundGap: { type: "number" },
  },
  required: ["width", "inside", "nearestBoundGap"],
} as const;
/** Calculate fossil calibration interval width term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minimumAge, maximumAge, nodeAge } = request;
  const compute = (): Output => {
    H.domain(minimumAge >= 0 && maximumAge >= minimumAge && nodeAge >= 0);
    return {
      width: maximumAge - minimumAge,
      inside: nodeAge >= minimumAge && nodeAge <= maximumAge,
      nearestBoundGap: Math.min(nodeAge - minimumAge, maximumAge - nodeAge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minimumAge: 10, maximumAge: 20, nodeAge: 16 },
  output: { width: 10, inside: true, nearestBoundGap: 4 },
} satisfies ToolExample<Input, Output>;
export const fossilCalibrationIntervalWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/fossil-calibration-interval-width-term",
    title: "Fossil Calibration Interval Width Term Tool",
    description:
      "Calculate fossil calibration interval width term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumAge: { type: "number", minimum: 0 },
        maximumAge: { type: "number" },
        nodeAge: { type: "number", minimum: 0 },
      },
      required: ["minimumAge", "maximumAge", "nodeAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        inside: { type: "boolean" },
        nearestBoundGap: { type: "number" },
      },
      required: ["width", "inside", "nearestBoundGap"],
    },
    ports: {
      inputs: [
        {
          id: "minimumAge",
          label: "Minimum Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumAge",
          label: "Maximum Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nodeAge",
          label: "Node Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "nearestBoundGap",
          label: "Nearest Bound Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fossilCalibrationIntervalWidthTermTool.execute;
export default fossilCalibrationIntervalWidthTermTool;

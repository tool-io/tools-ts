import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestPick: number;
  readonly latestPick: number;
  readonly referencePick: number;
};
export type Output = {
  readonly width: number;
  readonly earliestResidual: number;
  readonly latestResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestPick: { type: "number" },
    latestPick: { type: "number" },
    referencePick: { type: "number" },
  },
  required: ["earliestPick", "latestPick", "referencePick"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    earliestResidual: { type: "number" },
    latestResidual: { type: "number" },
  },
  required: ["width", "earliestResidual", "latestResidual"],
} as const;
/** Calculate travel time pick precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestPick, latestPick, referencePick } = request;
  const compute = (): Output => {
    H.domain(latestPick >= earliestPick);
    return {
      width: latestPick - earliestPick,
      earliestResidual: earliestPick - referencePick,
      latestResidual: latestPick - referencePick,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestPick: 10, latestPick: 12, referencePick: 11 },
  output: { width: 2, earliestResidual: -1, latestResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const travelTimePickPrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/travel-time-pick-precision-gap",
    title: "Travel Time Pick Precision Gap Tool",
    description:
      "Calculate travel time pick precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestPick: { type: "number" },
        latestPick: { type: "number" },
        referencePick: { type: "number" },
      },
      required: ["earliestPick", "latestPick", "referencePick"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        earliestResidual: { type: "number" },
        latestResidual: { type: "number" },
      },
      required: ["width", "earliestResidual", "latestResidual"],
    },
    ports: {
      inputs: [
        {
          id: "earliestPick",
          label: "Earliest Pick",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestPick",
          label: "Latest Pick",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePick",
          label: "Reference Pick",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "earliestResidual",
          label: "Earliest Residual",
          valueType: { type: "number" },
        },
        {
          id: "latestResidual",
          label: "Latest Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = travelTimePickPrecisionGapTool.execute;
export default travelTimePickPrecisionGapTool;

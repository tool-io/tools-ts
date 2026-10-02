import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distanceToBoundary: number;
  readonly groundSpeed: number;
  readonly latency: number;
};
export type Output = {
  readonly timeToBoundary: number;
  readonly remainingMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceToBoundary: { type: "number" },
    groundSpeed: { type: "number", exclusiveMinimum: 0 },
    latency: { type: "number", minimum: 0 },
  },
  required: ["distanceToBoundary", "groundSpeed", "latency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeToBoundary: { type: "number" },
    remainingMargin: { type: "number" },
  },
  required: ["timeToBoundary", "remainingMargin"],
} as const;
/** Calculate section control headland entry timegap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distanceToBoundary, groundSpeed, latency } = request;
  const compute = (): Output => {
    H.positive(groundSpeed);
    H.domain(latency >= 0);
    return {
      timeToBoundary: distanceToBoundary / groundSpeed,
      remainingMargin: distanceToBoundary / groundSpeed - latency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distanceToBoundary: 10, groundSpeed: 2, latency: 3 },
  output: { timeToBoundary: 5, remainingMargin: 2 },
} satisfies ToolExample<Input, Output>;
export const sectionControlHeadlandEntryTimegapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/section-control-headland-entry-timegap",
    title: "Section Control Headland Entry Timegap Tool",
    description:
      "Calculate section control headland entry timegap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceToBoundary: { type: "number" },
        groundSpeed: { type: "number", exclusiveMinimum: 0 },
        latency: { type: "number", minimum: 0 },
      },
      required: ["distanceToBoundary", "groundSpeed", "latency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeToBoundary: { type: "number" },
        remainingMargin: { type: "number" },
      },
      required: ["timeToBoundary", "remainingMargin"],
    },
    ports: {
      inputs: [
        {
          id: "distanceToBoundary",
          label: "Distance To Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groundSpeed",
          label: "Ground Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latency",
          label: "Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timeToBoundary",
          label: "Time To Boundary",
          valueType: { type: "number" },
        },
        {
          id: "remainingMargin",
          label: "Remaining Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionControlHeadlandEntryTimegapTool.execute;
export default sectionControlHeadlandEntryTimegapTool;

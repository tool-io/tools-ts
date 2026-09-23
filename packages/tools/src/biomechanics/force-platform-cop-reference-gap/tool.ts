import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredX: number;
  readonly measuredY: number;
  readonly referenceX: number;
  readonly referenceY: number;
};
export type Output = {
  readonly dx: number;
  readonly dy: number;
  readonly distance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredX: { type: "number" },
    measuredY: { type: "number" },
    referenceX: { type: "number" },
    referenceY: { type: "number" },
  },
  required: ["measuredX", "measuredY", "referenceX", "referenceY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dx: { type: "number" },
    dy: { type: "number" },
    distance: { type: "number" },
  },
  required: ["dx", "dy", "distance"],
} as const;
/** Compare supplied center-of-pressure coordinates in one frame without deriving COP from wrench data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredX, measuredY, referenceX, referenceY } = request;
  const compute = (): Output => {
    return {
      dx: measuredX - referenceX,
      dy: measuredY - referenceY,
      distance: Math.hypot(measuredX - referenceX, measuredY - referenceY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredX: 4, measuredY: 6, referenceX: 1, referenceY: 2 },
  output: { dx: 3, dy: 4, distance: 5 },
} satisfies ToolExample<Input, Output>;
export const forcePlatformCopReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/force-platform-cop-reference-gap",
    title: "Force Platform Cop Reference Gap Tool",
    description:
      "Compare supplied center-of-pressure coordinates in one frame without deriving COP from wrench data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredX: { type: "number" },
        measuredY: { type: "number" },
        referenceX: { type: "number" },
        referenceY: { type: "number" },
      },
      required: ["measuredX", "measuredY", "referenceX", "referenceY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dx: { type: "number" },
        dy: { type: "number" },
        distance: { type: "number" },
      },
      required: ["dx", "dy", "distance"],
    },
    ports: {
      inputs: [
        {
          id: "measuredX",
          label: "Measured X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredY",
          label: "Measured Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceX",
          label: "Reference X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceY",
          label: "Reference Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dx", label: "Dx", valueType: { type: "number" } },
        { id: "dy", label: "Dy", valueType: { type: "number" } },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forcePlatformCopReferenceGapTool.execute;
export default forcePlatformCopReferenceGapTool;

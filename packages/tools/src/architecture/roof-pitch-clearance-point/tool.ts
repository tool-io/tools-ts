import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalDistance: number;
  readonly risePerRun: number;
  readonly originHeight: number;
  readonly obstructionHeight: number;
};
export type Output = {
  readonly roofHeight: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalDistance: { type: "number" },
    risePerRun: { type: "number" },
    originHeight: { type: "number" },
    obstructionHeight: { type: "number" },
  },
  required: [
    "horizontalDistance",
    "risePerRun",
    "originHeight",
    "obstructionHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { roofHeight: { type: "number" }, clearance: { type: "number" } },
  required: ["roofHeight", "clearance"],
} as const;
/** Evaluate one ideal roof-line point from supplied dimensions without a structural or code-compliance assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalDistance, risePerRun, originHeight, obstructionHeight } =
    request;
  const compute = (): Output => {
    return {
      roofHeight: originHeight + horizontalDistance * risePerRun,
      clearance:
        originHeight + horizontalDistance * risePerRun - obstructionHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    horizontalDistance: 4,
    risePerRun: 0.5,
    originHeight: 2,
    obstructionHeight: 3,
  },
  output: { roofHeight: 4, clearance: 1 },
} satisfies ToolExample<Input, Output>;
export const roofPitchClearancePointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/roof-pitch-clearance-point",
    title: "Roof Pitch Clearance Point Tool",
    description:
      "Evaluate one ideal roof-line point from supplied dimensions without a structural or code-compliance assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalDistance: { type: "number" },
        risePerRun: { type: "number" },
        originHeight: { type: "number" },
        obstructionHeight: { type: "number" },
      },
      required: [
        "horizontalDistance",
        "risePerRun",
        "originHeight",
        "obstructionHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roofHeight: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["roofHeight", "clearance"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalDistance",
          label: "Horizontal Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "risePerRun",
          label: "Rise Per Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originHeight",
          label: "Origin Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "obstructionHeight",
          label: "Obstruction Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "roofHeight",
          label: "Roof Height",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roofPitchClearancePointTool.execute;
export default roofPitchClearancePointTool;

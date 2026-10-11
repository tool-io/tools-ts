import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceWalkingDistance: number;
  readonly recordedPlatformWalkingDistance: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceWalkingDistance: { type: "number" },
    recordedPlatformWalkingDistance: { type: "number" },
  },
  required: ["referenceWalkingDistance", "recordedPlatformWalkingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference walking distance from recorded platform-route distance on compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceWalkingDistance, recordedPlatformWalkingDistance } = request;
  const compute = (): Output => {
    return {
      signedGap: recordedPlatformWalkingDistance - referenceWalkingDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceWalkingDistance: 12, recordedPlatformWalkingDistance: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const transitStopPlatformWalkOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-planning", "urban planning", "arts and design"],
      keywords: ["urban planning", "arts and design"],
    },
    id: "urban-planning/transit-stop-platform-walk-offset",
    title: "Transit Stop Platform Walk Offset",
    description:
      "Subtract an explicit reference walking distance from recorded platform-route distance on compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceWalkingDistance: { type: "number" },
        recordedPlatformWalkingDistance: { type: "number" },
      },
      required: ["referenceWalkingDistance", "recordedPlatformWalkingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceWalkingDistance",
          label: "Reference Walking Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedPlatformWalkingDistance",
          label: "Recorded Platform Walking Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = transitStopPlatformWalkOffsetTool.execute;
export default transitStopPlatformWalkOffsetTool;

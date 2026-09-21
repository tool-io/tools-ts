import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reelStart: number;
  readonly reelLength: number;
  readonly absoluteFrame: number;
};
export type Output = { readonly inside: boolean; readonly localFrame: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reelStart: { type: "integer", minimum: 0 },
    reelLength: { type: "integer", minimum: 0 },
    absoluteFrame: { type: "integer", minimum: 0 },
  },
  required: ["reelStart", "reelLength", "absoluteFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" }, localFrame: { type: "integer" } },
  required: ["inside", "localFrame"],
} as const;
/** Map a frame to a supplied half-open reel interval; outside indices remain signed relative coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reelStart, reelLength, absoluteFrame } = request;
  const compute = (): Output => {
    H.integer(reelStart, 0);
    H.integer(reelLength, 0);
    H.integer(absoluteFrame, 0);
    return {
      inside:
        absoluteFrame >= reelStart && absoluteFrame - reelStart < reelLength,
      localFrame: absoluteFrame - reelStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reelStart: 100, reelLength: 20, absoluteFrame: 119 },
  output: { inside: true, localFrame: 19 },
} satisfies ToolExample<Input, Output>;
export const archiveReelFrameBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/archive-reel-frame-boundary",
    title: "Archive Reel Frame Boundary Tool",
    description:
      "Map a frame to a supplied half-open reel interval; outside indices remain signed relative coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reelStart: { type: "integer", minimum: 0 },
        reelLength: { type: "integer", minimum: 0 },
        absoluteFrame: { type: "integer", minimum: 0 },
      },
      required: ["reelStart", "reelLength", "absoluteFrame"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "boolean" },
        localFrame: { type: "integer" },
      },
      required: ["inside", "localFrame"],
    },
    ports: {
      inputs: [
        {
          id: "reelStart",
          label: "Reel Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reelLength",
          label: "Reel Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "absoluteFrame",
          label: "Absolute Frame",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "localFrame",
          label: "Local Frame",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveReelFrameBoundaryTool.execute;
export default archiveReelFrameBoundaryTool;

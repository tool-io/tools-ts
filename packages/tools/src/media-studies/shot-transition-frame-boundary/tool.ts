import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastFirstShot: number;
  readonly firstSecondShot: number;
  readonly transitionFrames: number;
  readonly sharedFrames: number;
};
export type Output = { readonly unassignedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastFirstShot: { type: "integer", minimum: 0 },
    firstSecondShot: { type: "integer" },
    transitionFrames: { type: "integer", minimum: 0 },
    sharedFrames: { type: "integer", minimum: 0 },
  },
  required: [
    "lastFirstShot",
    "firstSecondShot",
    "transitionFrames",
    "sharedFrames",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unassignedGap: { type: "integer" } },
  required: ["unassignedGap"],
} as const;
/** Inclusive endpoint frame accounting with an explicit shared-transition-frame correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastFirstShot, firstSecondShot, transitionFrames, sharedFrames } =
    request;
  const compute = (): Output => {
    H.integer(lastFirstShot, 0);
    H.integer(firstSecondShot, lastFirstShot);
    H.integer(transitionFrames, 0);
    H.integer(sharedFrames, 0, transitionFrames);
    return {
      unassignedGap:
        firstSecondShot - lastFirstShot - 1 - transitionFrames + sharedFrames,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lastFirstShot: 100,
    firstSecondShot: 106,
    transitionFrames: 5,
    sharedFrames: 0,
  },
  output: { unassignedGap: 0 },
} satisfies ToolExample<Input, Output>;
export const shotTransitionFrameBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/shot-transition-frame-boundary",
    title: "Shot Transition Frame Boundary Tool",
    description:
      "Inclusive endpoint frame accounting with an explicit shared-transition-frame correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastFirstShot: { type: "integer", minimum: 0 },
        firstSecondShot: { type: "integer" },
        transitionFrames: { type: "integer", minimum: 0 },
        sharedFrames: { type: "integer", minimum: 0 },
      },
      required: [
        "lastFirstShot",
        "firstSecondShot",
        "transitionFrames",
        "sharedFrames",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unassignedGap: { type: "integer" } },
      required: ["unassignedGap"],
    },
    ports: {
      inputs: [
        {
          id: "lastFirstShot",
          label: "Last First Shot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstSecondShot",
          label: "First Second Shot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transitionFrames",
          label: "Transition Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedFrames",
          label: "Shared Frames",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unassignedGap",
          label: "Unassigned Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = shotTransitionFrameBoundaryTool.execute;
export default shotTransitionFrameBoundaryTool;

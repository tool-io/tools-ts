import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pathStartX: number;
  readonly pathStartY: number;
  readonly pathEndX: number;
  readonly pathEndY: number;
  readonly pointX: number;
  readonly pointY: number;
};
export type Output = { readonly leftPositiveDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathStartX: { type: "number" },
    pathStartY: { type: "number" },
    pathEndX: { type: "number" },
    pathEndY: { type: "number" },
    pointX: { type: "number" },
    pointY: { type: "number" },
  },
  required: [
    "pathStartX",
    "pathStartY",
    "pathEndX",
    "pathEndY",
    "pointX",
    "pointY",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leftPositiveDistance: { type: "number" } },
  required: ["leftPositiveDistance"],
} as const;
/** Compute signed perpendicular distance to an explicit directed planar line with left positive, without geodetic projection or steering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pathStartX, pathStartY, pathEndX, pathEndY, pointX, pointY } =
    request;
  const compute = (): Output => {
    H.domain(pathStartX !== pathEndX || pathStartY !== pathEndY, "pathEndX");
    return {
      leftPositiveDistance:
        ((pathEndX - pathStartX) * (pointY - pathStartY) -
          (pathEndY - pathStartY) * (pointX - pathStartX)) /
        Math.hypot(pathEndX - pathStartX, pathEndY - pathStartY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pathStartX: 0,
    pathStartY: 0,
    pathEndX: 10,
    pathEndY: 0,
    pointX: 3,
    pointY: 2,
  },
  output: { leftPositiveDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const guidanceCrossTrackErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/guidance-cross-track-error",
    title: "Guidance Cross Track Error",
    description:
      "Compute signed perpendicular distance to an explicit directed planar line with left positive, without geodetic projection or steering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathStartX: { type: "number" },
        pathStartY: { type: "number" },
        pathEndX: { type: "number" },
        pathEndY: { type: "number" },
        pointX: { type: "number" },
        pointY: { type: "number" },
      },
      required: [
        "pathStartX",
        "pathStartY",
        "pathEndX",
        "pathEndY",
        "pointX",
        "pointY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leftPositiveDistance: { type: "number" } },
      required: ["leftPositiveDistance"],
    },
    ports: {
      inputs: [
        {
          id: "pathStartX",
          label: "Path Start X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathStartY",
          label: "Path Start Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathEndX",
          label: "Path End X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathEndY",
          label: "Path End Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pointX",
          label: "Point X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pointY",
          label: "Point Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftPositiveDistance",
          label: "Left Positive Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = guidanceCrossTrackErrorTool.execute;
export default guidanceCrossTrackErrorTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headX: number;
  readonly headY: number;
  readonly headZ: number;
  readonly toeX: number;
  readonly toeY: number;
  readonly toeZ: number;
};
export type Output = {
  readonly planDistance: number;
  readonly straightLineDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headX: { type: "number" },
    headY: { type: "number" },
    headZ: { type: "number" },
    toeX: { type: "number" },
    toeY: { type: "number" },
    toeZ: { type: "number" },
  },
  required: ["headX", "headY", "headZ", "toeX", "toeY", "toeZ"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planDistance: { type: "number" },
    straightLineDistance: { type: "number" },
  },
  required: ["planDistance", "straightLineDistance"],
} as const;
/** Calculate supplied head-to-toe plan and three-dimensional straight-line distances without reconstructing a landslide travel path. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headX, headY, headZ, toeX, toeY, toeZ } = request;
  const compute = (): Output => {
    return {
      planDistance: Math.hypot(toeX - headX, toeY - headY),
      straightLineDistance: Math.hypot(
        toeX - headX,
        toeY - headY,
        toeZ - headZ,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headX: 0, headY: 0, headZ: 12, toeX: 3, toeY: 4, toeZ: 0 },
  output: { planDistance: 5, straightLineDistance: 13 },
} satisfies ToolExample<Input, Output>;
export const landslideScarHeadToeDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/landslide-scar-head-toe-distance-term",
    title: "Landslide Scar Head Toe Distance Term Tool",
    description:
      "Calculate supplied head-to-toe plan and three-dimensional straight-line distances without reconstructing a landslide travel path.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headX: { type: "number" },
        headY: { type: "number" },
        headZ: { type: "number" },
        toeX: { type: "number" },
        toeY: { type: "number" },
        toeZ: { type: "number" },
      },
      required: ["headX", "headY", "headZ", "toeX", "toeY", "toeZ"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planDistance: { type: "number" },
        straightLineDistance: { type: "number" },
      },
      required: ["planDistance", "straightLineDistance"],
    },
    ports: {
      inputs: [
        {
          id: "headX",
          label: "Head X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headY",
          label: "Head Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headZ",
          label: "Head Z",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toeX",
          label: "Toe X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toeY",
          label: "Toe Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toeZ",
          label: "Toe Z",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "planDistance",
          label: "Plan Distance",
          valueType: { type: "number" },
        },
        {
          id: "straightLineDistance",
          label: "Straight Line Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landslideScarHeadToeDistanceTermTool.execute;
export default landslideScarHeadToeDistanceTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStation: number;
  readonly secondStation: number;
  readonly firstOffset: number;
  readonly secondOffset: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStation: { type: "number" },
    secondStation: { type: "number" },
    firstOffset: { type: "number" },
    secondOffset: { type: "number" },
  },
  required: ["firstStation", "secondStation", "firstOffset", "secondOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Use a locally straight orthogonal station/offset frame; not a curved-road geodesic calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStation, secondStation, firstOffset, secondOffset } = request;
  const compute = (): Output => {
    return {
      distance: Math.hypot(
        secondStation - firstStation,
        secondOffset - firstOffset,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStation: 10,
    secondStation: 13,
    firstOffset: 2,
    secondOffset: 6,
  },
  output: { distance: 5 },
} satisfies ToolExample<Input, Output>;
export const roadChainageOffsetDistancePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/road-chainage-offset-distance-pair",
    title: "Road Chainage Offset Distance Pair Tool",
    description:
      "Use a locally straight orthogonal station/offset frame; not a curved-road geodesic calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStation: { type: "number" },
        secondStation: { type: "number" },
        firstOffset: { type: "number" },
        secondOffset: { type: "number" },
      },
      required: [
        "firstStation",
        "secondStation",
        "firstOffset",
        "secondOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "firstStation",
          label: "First Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStation",
          label: "Second Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOffset",
          label: "First Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOffset",
          label: "Second Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roadChainageOffsetDistancePairTool.execute;
export default roadChainageOffsetDistancePairTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hedgeCenterOffset: number;
  readonly matureHedgeWidth: number;
};
export type Output = {
  readonly nearestEdgeOffset: number;
  readonly extendsPastLine: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hedgeCenterOffset: { type: "number", minimum: 0 },
    matureHedgeWidth: { type: "number", minimum: 0 },
  },
  required: ["hedgeCenterOffset", "matureHedgeWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearestEdgeOffset: { type: "number" },
    extendsPastLine: { type: "boolean" },
  },
  required: ["nearestEdgeOffset", "extendsPastLine"],
} as const;
/** Locate the nearest edge of a symmetric hedge relative to a straight property line using an explicit width, without assigning legal setbacks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hedgeCenterOffset, matureHedgeWidth } = request;
  const compute = (): Output => {
    H.domain(
      hedgeCenterOffset >= 0 && matureHedgeWidth >= 0,
      "hedgeCenterOffset",
    );
    return {
      nearestEdgeOffset: hedgeCenterOffset - matureHedgeWidth / 2,
      extendsPastLine: hedgeCenterOffset < matureHedgeWidth / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hedgeCenterOffset: 1.5, matureHedgeWidth: 2 },
  output: { nearestEdgeOffset: 0.5, extendsPastLine: false },
} satisfies ToolExample<Input, Output>;
export const hedgeOffsetPropertyLineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/hedge-offset-property-line",
    title: "Hedge Offset Property Line Tool",
    description:
      "Locate the nearest edge of a symmetric hedge relative to a straight property line using an explicit width, without assigning legal setbacks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hedgeCenterOffset: { type: "number", minimum: 0 },
        matureHedgeWidth: { type: "number", minimum: 0 },
      },
      required: ["hedgeCenterOffset", "matureHedgeWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearestEdgeOffset: { type: "number" },
        extendsPastLine: { type: "boolean" },
      },
      required: ["nearestEdgeOffset", "extendsPastLine"],
    },
    ports: {
      inputs: [
        {
          id: "hedgeCenterOffset",
          label: "Hedge Center Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matureHedgeWidth",
          label: "Mature Hedge Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nearestEdgeOffset",
          label: "Nearest Edge Offset",
          valueType: { type: "number" },
        },
        {
          id: "extendsPastLine",
          label: "Extends Past Line",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hedgeOffsetPropertyLineTool.execute;
export default hedgeOffsetPropertyLineTool;

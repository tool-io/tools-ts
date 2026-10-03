import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
  readonly firstEndClosed: boolean;
  readonly secondStartClosed: boolean;
};
export type Output = {
  readonly touch: boolean;
  readonly intersectionIsPoint: boolean;
  readonly connectedUnion: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number" },
    firstUpper: { type: "number" },
    secondLower: { type: "number" },
    secondUpper: { type: "number" },
    firstEndClosed: { type: "boolean" },
    secondStartClosed: { type: "boolean" },
  },
  required: [
    "firstLower",
    "firstUpper",
    "secondLower",
    "secondUpper",
    "firstEndClosed",
    "secondStartClosed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    touch: { type: "boolean" },
    intersectionIsPoint: { type: "boolean" },
    connectedUnion: { type: "boolean" },
  },
  required: ["touch", "intersectionIsPoint", "connectedUnion"],
} as const;
/** Touch behavior of two ordered nonoverlapping interval interiors with explicit adjacent endpoint closure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstLower,
    firstUpper,
    secondLower,
    secondUpper,
    firstEndClosed,
    secondStartClosed,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstLower <= firstUpper &&
        secondLower <= secondUpper &&
        firstUpper <= secondLower,
    );
    const touch = firstUpper === secondLower;
    return {
      touch,
      intersectionIsPoint: touch && firstEndClosed && secondStartClosed,
      connectedUnion: touch && (firstEndClosed || secondStartClosed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLower: 0,
    firstUpper: 1,
    secondLower: 1,
    secondUpper: 2,
    firstEndClosed: true,
    secondStartClosed: false,
  },
  output: { touch: true, intersectionIsPoint: false, connectedUnion: true },
} satisfies ToolExample<Input, Output>;
export const intervalTouchPointIsolatedFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/interval-touch-point-isolated-flag",
    title: "Interval Touch Point Isolated Flag Tool",
    description:
      "Touch behavior of two ordered nonoverlapping interval interiors with explicit adjacent endpoint closure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "number" },
        firstUpper: { type: "number" },
        secondLower: { type: "number" },
        secondUpper: { type: "number" },
        firstEndClosed: { type: "boolean" },
        secondStartClosed: { type: "boolean" },
      },
      required: [
        "firstLower",
        "firstUpper",
        "secondLower",
        "secondUpper",
        "firstEndClosed",
        "secondStartClosed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        touch: { type: "boolean" },
        intersectionIsPoint: { type: "boolean" },
        connectedUnion: { type: "boolean" },
      },
      required: ["touch", "intersectionIsPoint", "connectedUnion"],
    },
    ports: {
      inputs: [
        {
          id: "firstLower",
          label: "First Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstUpper",
          label: "First Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLower",
          label: "Second Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondUpper",
          label: "Second Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndClosed",
          label: "First End Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondStartClosed",
          label: "Second Start Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "touch", label: "Touch", valueType: { type: "boolean" } },
        {
          id: "intersectionIsPoint",
          label: "Intersection Is Point",
          valueType: { type: "boolean" },
        },
        {
          id: "connectedUnion",
          label: "Connected Union",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = intervalTouchPointIsolatedFlagTool.execute;
export default intervalTouchPointIsolatedFlagTool;

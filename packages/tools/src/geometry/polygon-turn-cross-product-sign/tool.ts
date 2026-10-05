import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousX: number;
  readonly previousY: number;
  readonly currentX: number;
  readonly currentY: number;
  readonly nextX: number;
  readonly nextY: number;
};
export type Output = { readonly crossProduct: number; readonly turn: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousX: { type: "number" },
    previousY: { type: "number" },
    currentX: { type: "number" },
    currentY: { type: "number" },
    nextX: { type: "number" },
    nextY: { type: "number" },
  },
  required: [
    "previousX",
    "previousY",
    "currentX",
    "currentY",
    "nextX",
    "nextY",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossProduct: { type: "number" },
    turn: { type: "string", maxLength: 8192 },
  },
  required: ["crossProduct", "turn"],
} as const;
/** Classify the directed turn at a polygon vertex using the exact floating-point cross-product sign; no tolerance is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousX, previousY, currentX, currentY, nextX, nextY } = request;
  const compute = (): Output => {
    return (() => {
      const crossProduct =
        (currentX - previousX) * (nextY - currentY) -
        (currentY - previousY) * (nextX - currentX);
      return {
        crossProduct,
        turn:
          crossProduct > 0 ? "left" : crossProduct < 0 ? "right" : "collinear",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousX: 0,
    previousY: 0,
    currentX: 2,
    currentY: 0,
    nextX: 2,
    nextY: 3,
  },
  output: { crossProduct: 6, turn: "left" },
} satisfies ToolExample<Input, Output>;
export const polygonTurnCrossProductSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/polygon-turn-cross-product-sign",
    title: "Polygon Turn Cross Product Sign Tool",
    description:
      "Classify the directed turn at a polygon vertex using the exact floating-point cross-product sign; no tolerance is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousX: { type: "number" },
        previousY: { type: "number" },
        currentX: { type: "number" },
        currentY: { type: "number" },
        nextX: { type: "number" },
        nextY: { type: "number" },
      },
      required: [
        "previousX",
        "previousY",
        "currentX",
        "currentY",
        "nextX",
        "nextY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crossProduct: { type: "number" },
        turn: { type: "string", maxLength: 8192 },
      },
      required: ["crossProduct", "turn"],
    },
    ports: {
      inputs: [
        {
          id: "previousX",
          label: "Previous X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousY",
          label: "Previous Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentX",
          label: "Current X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentY",
          label: "Current Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextX",
          label: "Next X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextY",
          label: "Next Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "crossProduct",
          label: "Cross Product",
          valueType: { type: "number" },
        },
        { id: "turn", label: "Turn", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = polygonTurnCrossProductSignTool.execute;
export default polygonTurnCrossProductSignTool;

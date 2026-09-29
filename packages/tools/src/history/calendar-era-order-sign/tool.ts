import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoordinate: number;
  readonly secondCoordinate: number;
  readonly increasingIsLater: boolean;
};
export type Output = { readonly chronologicalOrder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoordinate: { type: "number" },
    secondCoordinate: { type: "number" },
    increasingIsLater: { type: "boolean" },
  },
  required: ["firstCoordinate", "secondCoordinate", "increasingIsLater"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chronologicalOrder: { type: "integer" } },
  required: ["chronologicalOrder"],
} as const;
/** Compare supplied same-era coordinates with an explicit direction; no calendar or era conversion is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoordinate, secondCoordinate, increasingIsLater } = request;
  const compute = (): Output => {
    return {
      chronologicalOrder:
        Math.sign(secondCoordinate - firstCoordinate) *
        (increasingIsLater ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCoordinate: 10, secondCoordinate: 12, increasingIsLater: true },
  output: { chronologicalOrder: 1 },
} satisfies ToolExample<Input, Output>;
export const calendarEraOrderSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/calendar-era-order-sign",
    title: "Calendar Era Order Sign Tool",
    description:
      "Compare supplied same-era coordinates with an explicit direction; no calendar or era conversion is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoordinate: { type: "number" },
        secondCoordinate: { type: "number" },
        increasingIsLater: { type: "boolean" },
      },
      required: ["firstCoordinate", "secondCoordinate", "increasingIsLater"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chronologicalOrder: { type: "integer" } },
      required: ["chronologicalOrder"],
    },
    ports: {
      inputs: [
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCoordinate",
          label: "Second Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "increasingIsLater",
          label: "Increasing Is Later",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "chronologicalOrder",
          label: "Chronological Order",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = calendarEraOrderSignTool.execute;
export default calendarEraOrderSignTool;

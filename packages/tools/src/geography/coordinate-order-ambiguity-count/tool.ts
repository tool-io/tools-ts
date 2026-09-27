import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly validOrders: number;
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validOrders: { type: "integer" },
    ambiguous: { type: "boolean" },
  },
  required: ["validOrders", "ambiguous"],
} as const;
/** Count valid longitude/latitude versus latitude/longitude numeric interpretations without guessing the intended order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const lonLat = Math.abs(first) <= 180 && Math.abs(second) <= 90,
      latLon = Math.abs(first) <= 90 && Math.abs(second) <= 180,
      validOrders = Number(lonLat) + Number(latLon);
    return { validOrders, ambiguous: validOrders === 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 20, second: 30 },
  output: { validOrders: 2, ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const coordinateOrderAmbiguityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/coordinate-order-ambiguity-count",
    title: "Coordinate Order Ambiguity Count Tool",
    description:
      "Count valid longitude/latitude versus latitude/longitude numeric interpretations without guessing the intended order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validOrders: { type: "integer" },
        ambiguous: { type: "boolean" },
      },
      required: ["validOrders", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "validOrders",
          label: "Valid Orders",
          valueType: { type: "integer" },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = coordinateOrderAmbiguityCountTool.execute;
export default coordinateOrderAmbiguityCountTool;

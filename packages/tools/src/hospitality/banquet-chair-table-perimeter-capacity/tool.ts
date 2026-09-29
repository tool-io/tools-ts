import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perimeter: number;
  readonly unavailable: number;
  readonly widthPerSeat: number;
};
export type Output = { readonly capacity: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number" },
    unavailable: { type: "number", minimum: 0 },
    widthPerSeat: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["perimeter", "unavailable", "widthPerSeat"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capacity: { type: "integer" }, remainder: { type: "number" } },
  required: ["capacity", "remainder"],
} as const;
/** Linear perimeter capacity estimate, excluding corner-layout and access constraints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeter, unavailable, widthPerSeat } = request;
  const compute = (): Output => {
    H.domain(unavailable >= 0 && perimeter >= unavailable);
    H.positive(widthPerSeat);
    return {
      capacity: Math.floor((perimeter - unavailable) / widthPerSeat),
      remainder: (perimeter - unavailable) % widthPerSeat,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeter: 12, unavailable: 2, widthPerSeat: 0.5 },
  output: { capacity: 20, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const banquetChairTablePerimeterCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/banquet-chair-table-perimeter-capacity",
    title: "Banquet Chair Table Perimeter Capacity Tool",
    description:
      "Linear perimeter capacity estimate, excluding corner-layout and access constraints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number" },
        unavailable: { type: "number", minimum: 0 },
        widthPerSeat: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["perimeter", "unavailable", "widthPerSeat"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "integer" },
        remainder: { type: "number" },
      },
      required: ["capacity", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "perimeter",
          label: "Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailable",
          label: "Unavailable",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "widthPerSeat",
          label: "Width Per Seat",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "capacity", label: "Capacity", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = banquetChairTablePerimeterCapacityTool.execute;
export default banquetChairTablePerimeterCapacityTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tableRadius: number;
  readonly seatCount: number;
};
export type Output = {
  readonly anglePerSeatDegrees: number;
  readonly perimeterArcPerSeat: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tableRadius: { type: "number", exclusiveMinimum: 0 },
    seatCount: { type: "integer", minimum: 1 },
  },
  required: ["tableRadius", "seatCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anglePerSeatDegrees: { type: "number" },
    perimeterArcPerSeat: { type: "number" },
  },
  required: ["anglePerSeatDegrees", "perimeterArcPerSeat"],
} as const;
/** Divide a circular banquet-table perimeter equally among seats; geometric arc space is not a seating-safety recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tableRadius, seatCount } = request;
  const compute = (): Output => {
    (H.domain(tableRadius > 0, "tableRadius"), tableRadius);
    (H.domain(
      Number.isSafeInteger(seatCount) &&
        seatCount >= 1 &&
        seatCount <= Number.MAX_SAFE_INTEGER,
      "seatCount",
    ),
      seatCount);
    return {
      anglePerSeatDegrees: 360 / seatCount,
      perimeterArcPerSeat: (2 * Math.PI * tableRadius) / seatCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tableRadius: 1, seatCount: 8 },
  output: { anglePerSeatDegrees: 45, perimeterArcPerSeat: 0.7853981633974483 },
} satisfies ToolExample<Input, Output>;
export const banquetRoundTableSeatArcTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/banquet-round-table-seat-arc",
    title: "Banquet Round Table Seat Arc Tool",
    description:
      "Divide a circular banquet-table perimeter equally among seats; geometric arc space is not a seating-safety recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tableRadius: { type: "number", exclusiveMinimum: 0 },
        seatCount: { type: "integer", minimum: 1 },
      },
      required: ["tableRadius", "seatCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anglePerSeatDegrees: { type: "number" },
        perimeterArcPerSeat: { type: "number" },
      },
      required: ["anglePerSeatDegrees", "perimeterArcPerSeat"],
    },
    ports: {
      inputs: [
        {
          id: "tableRadius",
          label: "Table Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seatCount",
          label: "Seat Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "anglePerSeatDegrees",
          label: "Angle Per Seat Degrees",
          valueType: { type: "number" },
        },
        {
          id: "perimeterArcPerSeat",
          label: "Perimeter Arc Per Seat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = banquetRoundTableSeatArcTool.execute;
export default banquetRoundTableSeatArcTool;

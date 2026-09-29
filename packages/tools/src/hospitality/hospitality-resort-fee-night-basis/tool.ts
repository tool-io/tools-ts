import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nights: number;
  readonly rooms: number;
  readonly feePerRoomNight: number;
  readonly taxableFraction: number;
  readonly taxRate: number;
};
export type Output = {
  readonly fee: number;
  readonly tax: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nights: { type: "integer", minimum: 0 },
    rooms: { type: "integer", minimum: 0 },
    feePerRoomNight: { type: "number", minimum: 0 },
    taxableFraction: { type: "number", minimum: 0, maximum: 1 },
    taxRate: { type: "number", minimum: 0 },
  },
  required: [
    "nights",
    "rooms",
    "feePerRoomNight",
    "taxableFraction",
    "taxRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fee: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
  },
  required: ["fee", "tax", "total"],
} as const;
/** Apply caller-supplied per-room-night fee and taxable fraction without choosing a jurisdiction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nights, rooms, feePerRoomNight, taxableFraction, taxRate } = request;
  const compute = (): Output => {
    H.integer(nights, 0);
    H.integer(rooms, 0);
    H.domain(feePerRoomNight >= 0 && taxRate >= 0);
    H.probability(taxableFraction);
    return {
      fee: nights * rooms * feePerRoomNight,
      tax: nights * rooms * feePerRoomNight * taxableFraction * taxRate,
      total: nights * rooms * feePerRoomNight * (1 + taxableFraction * taxRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nights: 3,
    rooms: 2,
    feePerRoomNight: 20,
    taxableFraction: 1,
    taxRate: 0.1,
  },
  output: { fee: 120, tax: 12, total: 132 },
} satisfies ToolExample<Input, Output>;
export const hospitalityResortFeeNightBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hospitality-resort-fee-night-basis",
    title: "Hospitality Resort Fee Night Basis Tool",
    description:
      "Apply caller-supplied per-room-night fee and taxable fraction without choosing a jurisdiction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nights: { type: "integer", minimum: 0 },
        rooms: { type: "integer", minimum: 0 },
        feePerRoomNight: { type: "number", minimum: 0 },
        taxableFraction: { type: "number", minimum: 0, maximum: 1 },
        taxRate: { type: "number", minimum: 0 },
      },
      required: [
        "nights",
        "rooms",
        "feePerRoomNight",
        "taxableFraction",
        "taxRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fee: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" },
      },
      required: ["fee", "tax", "total"],
    },
    ports: {
      inputs: [
        {
          id: "nights",
          label: "Nights",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rooms",
          label: "Rooms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "feePerRoomNight",
          label: "Fee Per Room Night",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxableFraction",
          label: "Taxable Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fee", label: "Fee", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hospitalityResortFeeNightBasisTool.execute;
export default hospitalityResortFeeNightBasisTool;

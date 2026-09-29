import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guests: number;
  readonly seatsPerPlate: number;
  readonly reservePlates: number;
};
export type Output = { readonly plates: number; readonly spareCovers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guests: { type: "integer", minimum: 0 },
    seatsPerPlate: { type: "integer", minimum: 1 },
    reservePlates: { type: "integer", minimum: 0 },
  },
  required: ["guests", "seatsPerPlate", "reservePlates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plates: { type: "integer" }, spareCovers: { type: "integer" } },
  required: ["plates", "spareCovers"],
} as const;
/** Calculate banquet shared plate cover count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guests, seatsPerPlate, reservePlates } = request;
  const compute = (): Output => {
    H.integer(guests, 0);
    H.integer(seatsPerPlate, 1);
    H.integer(reservePlates, 0);
    const g = BigInt(guests),
      s = BigInt(seatsPerPlate),
      p = (g + s - 1n) / s + BigInt(reservePlates);
    return { plates: Number(p), spareCovers: Number(p * s - g) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guests: 25, seatsPerPlate: 4, reservePlates: 2 },
  output: { plates: 9, spareCovers: 11 },
} satisfies ToolExample<Input, Output>;
export const banquetSharedPlateCoverCountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/banquet-shared-plate-cover-count-factor",
    title: "Banquet Shared Plate Cover Count Factor Tool",
    description:
      "Calculate banquet shared plate cover count factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guests: { type: "integer", minimum: 0 },
        seatsPerPlate: { type: "integer", minimum: 1 },
        reservePlates: { type: "integer", minimum: 0 },
      },
      required: ["guests", "seatsPerPlate", "reservePlates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plates: { type: "integer" },
        spareCovers: { type: "integer" },
      },
      required: ["plates", "spareCovers"],
    },
    ports: {
      inputs: [
        {
          id: "guests",
          label: "Guests",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seatsPerPlate",
          label: "Seats Per Plate",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservePlates",
          label: "Reserve Plates",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "plates", label: "Plates", valueType: { type: "integer" } },
        {
          id: "spareCovers",
          label: "Spare Covers",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = banquetSharedPlateCoverCountFactorTool.execute;
export default banquetSharedPlateCoverCountFactorTool;

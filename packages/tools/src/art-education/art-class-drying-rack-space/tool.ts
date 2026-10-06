import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rackSlots: number;
  readonly occupiedSlots: number;
  readonly incomingPieces: number;
};
export type Output = {
  readonly freeSlots: number;
  readonly overflowPieces: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rackSlots: { type: "integer", minimum: 0 },
    occupiedSlots: { type: "integer", minimum: 0 },
    incomingPieces: { type: "integer", minimum: 0 },
  },
  required: ["rackSlots", "occupiedSlots", "incomingPieces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeSlots: { type: "integer" },
    overflowPieces: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["freeSlots", "overflowPieces", "fits"],
} as const;
/** Compare one-piece-per-slot drying-rack occupancy with an explicitly counted incoming class batch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rackSlots, occupiedSlots, incomingPieces } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rackSlots) &&
        rackSlots >= 0 &&
        rackSlots <= Number.MAX_SAFE_INTEGER,
      "rackSlots",
    ),
      rackSlots);
    (H.domain(
      Number.isSafeInteger(occupiedSlots) &&
        occupiedSlots >= 0 &&
        occupiedSlots <= rackSlots,
      "occupiedSlots",
    ),
      occupiedSlots);
    (H.domain(
      Number.isSafeInteger(incomingPieces) &&
        incomingPieces >= 0 &&
        incomingPieces <= Number.MAX_SAFE_INTEGER,
      "incomingPieces",
    ),
      incomingPieces);
    return {
      freeSlots: rackSlots - occupiedSlots,
      overflowPieces: Math.max(0, incomingPieces - (rackSlots - occupiedSlots)),
      fits: incomingPieces <= rackSlots - occupiedSlots,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rackSlots: 30, occupiedSlots: 22, incomingPieces: 10 },
  output: { freeSlots: 8, overflowPieces: 2, fits: false },
} satisfies ToolExample<Input, Output>;
export const artClassDryingRackSpaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-class-drying-rack-space",
    title: "Art Class Drying Rack Space",
    description:
      "Compare one-piece-per-slot drying-rack occupancy with an explicitly counted incoming class batch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rackSlots: { type: "integer", minimum: 0 },
        occupiedSlots: { type: "integer", minimum: 0 },
        incomingPieces: { type: "integer", minimum: 0 },
      },
      required: ["rackSlots", "occupiedSlots", "incomingPieces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeSlots: { type: "integer" },
        overflowPieces: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["freeSlots", "overflowPieces", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "rackSlots",
          label: "Rack Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupiedSlots",
          label: "Occupied Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "incomingPieces",
          label: "Incoming Pieces",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "freeSlots",
          label: "Free Slots",
          valueType: { type: "integer" },
        },
        {
          id: "overflowPieces",
          label: "Overflow Pieces",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = artClassDryingRackSpaceTool.execute;
export default artClassDryingRackSpaceTool;

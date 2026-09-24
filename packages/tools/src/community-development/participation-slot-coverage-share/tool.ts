import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableSlots: number;
  readonly occupiedSlots: number;
  readonly reservedUnavailable: number;
  readonly excludeReserved: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSlots: { type: "integer", minimum: 0 },
    occupiedSlots: { type: "integer", minimum: 0 },
    reservedUnavailable: { type: "integer", minimum: 0 },
    excludeReserved: { type: "boolean" },
  },
  required: [
    "availableSlots",
    "occupiedSlots",
    "reservedUnavailable",
    "excludeReserved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "share", "defined"],
} as const;
/** Calculate participation slot coverage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    availableSlots,
    occupiedSlots,
    reservedUnavailable,
    excludeReserved,
  } = request;
  const compute = (): Output => {
    H.integer(availableSlots, 0);
    H.integer(reservedUnavailable, 0, availableSlots);
    H.integer(occupiedSlots, 0, availableSlots - reservedUnavailable);
    return {
      denominator: availableSlots - (excludeReserved ? reservedUnavailable : 0),
      share:
        availableSlots - (excludeReserved ? reservedUnavailable : 0) > 0
          ? occupiedSlots /
            (availableSlots - (excludeReserved ? reservedUnavailable : 0))
          : 0,
      defined: availableSlots - (excludeReserved ? reservedUnavailable : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableSlots: 100,
    occupiedSlots: 60,
    reservedUnavailable: 20,
    excludeReserved: true,
  },
  output: { denominator: 80, share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const participationSlotCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/participation-slot-coverage-share",
    title: "Participation Slot Coverage Share Tool",
    description:
      "Calculate participation slot coverage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableSlots: { type: "integer", minimum: 0 },
        occupiedSlots: { type: "integer", minimum: 0 },
        reservedUnavailable: { type: "integer", minimum: 0 },
        excludeReserved: { type: "boolean" },
      },
      required: [
        "availableSlots",
        "occupiedSlots",
        "reservedUnavailable",
        "excludeReserved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "availableSlots",
          label: "Available Slots",
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
          id: "reservedUnavailable",
          label: "Reserved Unavailable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeReserved",
          label: "Exclude Reserved",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = participationSlotCoverageShareTool.execute;
export default participationSlotCoverageShareTool;

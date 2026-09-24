import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly dispensed: number;
  readonly returned: number;
  readonly discarded: number;
  readonly reserved: number;
};
export type Output = {
  readonly physical: number;
  readonly available: number;
  readonly netDispensed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    dispensed: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    discarded: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["opening", "dispensed", "returned", "discarded", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physical: { type: "integer" },
    available: { type: "integer" },
    netDispensed: { type: "integer" },
  },
  required: ["physical", "available", "netDispensed"],
} as const;
/** Calculate medication package remaining unit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, dispensed, returned, discarded, reserved } = request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(dispensed, 0);
    H.integer(returned, 0);
    H.integer(discarded, 0);
    H.integer(reserved, 0);
    H.domain(opening - dispensed + returned - discarded >= 0);
    return {
      physical: opening - dispensed + returned - discarded,
      available: opening - dispensed + returned - discarded - reserved,
      netDispensed: dispensed - returned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    dispensed: 40,
    returned: 5,
    discarded: 2,
    reserved: 10,
  },
  output: { physical: 63, available: 53, netDispensed: 35 },
} satisfies ToolExample<Input, Output>;
export const medicationPackageRemainingUnitBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medication-package-remaining-unit-balance",
      title: "Medication Package Remaining Unit Balance Tool",
      description:
        "Calculate medication package remaining unit balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "integer", minimum: 0 },
          dispensed: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          discarded: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
        },
        required: ["opening", "dispensed", "returned", "discarded", "reserved"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physical: { type: "integer" },
          available: { type: "integer" },
          netDispensed: { type: "integer" },
        },
        required: ["physical", "available", "netDispensed"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "dispensed",
            label: "Dispensed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discarded",
            label: "Discarded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "physical", label: "Physical", valueType: { type: "integer" } },
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
          {
            id: "netDispensed",
            label: "Net Dispensed",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicationPackageRemainingUnitBalanceTool.execute;
export default medicationPackageRemainingUnitBalanceTool;

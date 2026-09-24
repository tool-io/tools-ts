import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly physical: number;
  readonly quarantined: number;
  readonly reserved: number;
  readonly backordered: number;
};
export type Output = {
  readonly usable: number;
  readonly unreserved: number;
  readonly promiseGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physical: { type: "integer", minimum: 0 },
    quarantined: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    backordered: { type: "integer", minimum: 0 },
  },
  required: ["physical", "quarantined", "reserved", "backordered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usable: { type: "integer" },
    unreserved: { type: "integer" },
    promiseGap: { type: "integer" },
  },
  required: ["usable", "unreserved", "promiseGap"],
} as const;
/** Calculate medicine inventory reserved available gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { physical, quarantined, reserved, backordered } = request;
  const compute = (): Output => {
    H.integer(physical, 0);
    H.integer(quarantined, 0, physical);
    H.integer(reserved, 0);
    H.integer(backordered, 0);
    return {
      usable: physical - quarantined,
      unreserved: physical - quarantined - reserved,
      promiseGap: physical - quarantined - reserved - backordered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { physical: 100, quarantined: 10, reserved: 40, backordered: 60 },
  output: { usable: 90, unreserved: 50, promiseGap: -10 },
} satisfies ToolExample<Input, Output>;
export const medicineInventoryReservedAvailableGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medicine-inventory-reserved-available-gap",
      title: "Medicine Inventory Reserved Available Gap Tool",
      description:
        "Calculate medicine inventory reserved available gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physical: { type: "integer", minimum: 0 },
          quarantined: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
          backordered: { type: "integer", minimum: 0 },
        },
        required: ["physical", "quarantined", "reserved", "backordered"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usable: { type: "integer" },
          unreserved: { type: "integer" },
          promiseGap: { type: "integer" },
        },
        required: ["usable", "unreserved", "promiseGap"],
      },
      ports: {
        inputs: [
          {
            id: "physical",
            label: "Physical",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "quarantined",
            label: "Quarantined",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "backordered",
            label: "Backordered",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "usable", label: "Usable", valueType: { type: "integer" } },
          {
            id: "unreserved",
            label: "Unreserved",
            valueType: { type: "integer" },
          },
          {
            id: "promiseGap",
            label: "Promise Gap",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicineInventoryReservedAvailableGapTool.execute;
export default medicineInventoryReservedAvailableGapTool;

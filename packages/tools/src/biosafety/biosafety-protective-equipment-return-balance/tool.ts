import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly damaged: number;
  readonly lost: number;
};
export type Output = {
  readonly outstanding: number;
  readonly reusableReturned: number;
  readonly accounted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    damaged: { type: "integer", minimum: 0 },
    lost: { type: "integer", minimum: 0 },
  },
  required: ["issued", "returned", "damaged", "lost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outstanding: { type: "integer" },
    reusableReturned: { type: "integer" },
    accounted: { type: "integer" },
  },
  required: ["outstanding", "reusableReturned", "accounted"],
} as const;
/** Calculate biosafety protective equipment return balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, damaged, lost } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0, issued);
    H.integer(damaged, 0, returned);
    H.integer(lost, 0, issued - returned);
    return {
      outstanding: issued - returned - lost,
      reusableReturned: returned - damaged,
      accounted: returned + lost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, returned: 70, damaged: 5, lost: 3 },
  output: { outstanding: 27, reusableReturned: 65, accounted: 73 },
} satisfies ToolExample<Input, Output>;
export const biosafetyProtectiveEquipmentReturnBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-protective-equipment-return-balance",
      title: "Biosafety Protective Equipment Return Balance Tool",
      description:
        "Calculate biosafety protective equipment return balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issued: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          damaged: { type: "integer", minimum: 0 },
          lost: { type: "integer", minimum: 0 },
        },
        required: ["issued", "returned", "damaged", "lost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outstanding: { type: "integer" },
          reusableReturned: { type: "integer" },
          accounted: { type: "integer" },
        },
        required: ["outstanding", "reusableReturned", "accounted"],
      },
      ports: {
        inputs: [
          {
            id: "issued",
            label: "Issued",
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
            id: "damaged",
            label: "Damaged",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lost",
            label: "Lost",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "outstanding",
            label: "Outstanding",
            valueType: { type: "integer" },
          },
          {
            id: "reusableReturned",
            label: "Reusable Returned",
            valueType: { type: "integer" },
          },
          {
            id: "accounted",
            label: "Accounted",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyProtectiveEquipmentReturnBalanceTool.execute;
export default biosafetyProtectiveEquipmentReturnBalanceTool;

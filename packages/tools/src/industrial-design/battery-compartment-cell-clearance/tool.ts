import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalLength: number;
  readonly cellLength: number;
  readonly suppliedContactAllowance: number;
};
export type Output = { readonly remainingLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalLength: { type: "number", minimum: 0 },
    cellLength: { type: "number", minimum: 0 },
    suppliedContactAllowance: { type: "number", minimum: 0 },
  },
  required: ["internalLength", "cellLength", "suppliedContactAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingLength: { type: "number" } },
  required: ["remainingLength"],
} as const;
/** Subtract explicit cell length and contact allowance from compartment length without selecting battery types or assessing electrical safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalLength, cellLength, suppliedContactAllowance } = request;
  const compute = (): Output => {
    H.domain(
      internalLength >= 0 && cellLength >= 0 && suppliedContactAllowance >= 0,
      "internalLength",
    );
    return {
      remainingLength: internalLength - cellLength - suppliedContactAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { internalLength: 70, cellLength: 65, suppliedContactAllowance: 2 },
  output: { remainingLength: 3 },
} satisfies ToolExample<Input, Output>;
export const batteryCompartmentCellClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/battery-compartment-cell-clearance",
    title: "Battery Compartment Cell Clearance",
    description:
      "Subtract explicit cell length and contact allowance from compartment length without selecting battery types or assessing electrical safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalLength: { type: "number", minimum: 0 },
        cellLength: { type: "number", minimum: 0 },
        suppliedContactAllowance: { type: "number", minimum: 0 },
      },
      required: ["internalLength", "cellLength", "suppliedContactAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingLength: { type: "number" } },
      required: ["remainingLength"],
    },
    ports: {
      inputs: [
        {
          id: "internalLength",
          label: "Internal Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellLength",
          label: "Cell Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedContactAllowance",
          label: "Supplied Contact Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingLength",
          label: "Remaining Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryCompartmentCellClearanceTool.execute;
export default batteryCompartmentCellClearanceTool;

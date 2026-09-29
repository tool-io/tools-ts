import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalUnits: number;
  readonly unitsPerPack: number;
};
export type Output = {
  readonly completePacks: number;
  readonly remainingUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnits: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
  },
  required: ["totalUnits", "unitsPerPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completePacks: { type: "integer" },
    remainingUnits: { type: "integer" },
  },
  required: ["completePacks", "remainingUnits"],
} as const;
/** Decompose an explicit inventory count into whole packages and units; no dispensing recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalUnits, unitsPerPack } = request;
  const compute = (): Output => {
    H.integer(totalUnits, 0);
    H.integer(unitsPerPack, 1);
    const n = BigInt(totalUnits),
      d = BigInt(unitsPerPack);
    return { completePacks: Number(n / d), remainingUnits: Number(n % d) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalUnits: 103, unitsPerPack: 24 },
  output: { completePacks: 4, remainingUnits: 7 },
} satisfies ToolExample<Input, Output>;
export const medicinePackContentRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-pack-content-remainder",
    title: "Medicine Pack Content Remainder Tool",
    description:
      "Decompose an explicit inventory count into whole packages and units; no dispensing recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnits: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
      },
      required: ["totalUnits", "unitsPerPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completePacks: { type: "integer" },
        remainingUnits: { type: "integer" },
      },
      required: ["completePacks", "remainingUnits"],
    },
    ports: {
      inputs: [
        {
          id: "totalUnits",
          label: "Total Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completePacks",
          label: "Complete Packs",
          valueType: { type: "integer" },
        },
        {
          id: "remainingUnits",
          label: "Remaining Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicinePackContentRemainderTool.execute;
export default medicinePackContentRemainderTool;

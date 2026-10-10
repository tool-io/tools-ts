import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossExports: number;
  readonly domesticValueAdded: number;
  readonly foreignValueAdded: number;
};
export type Output = {
  readonly unassignedValue: number;
  readonly assignedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossExports: { type: "number", minimum: 0 },
    domesticValueAdded: { type: "number", minimum: 0 },
    foreignValueAdded: { type: "number", minimum: 0 },
  },
  required: ["grossExports", "domesticValueAdded", "foreignValueAdded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassignedValue: { type: "number" },
    assignedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["unassignedValue", "assignedShare", "defined"],
} as const;
/** Reconcile explicit domestic and foreign value-added allocations against gross exports without deriving input-output coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossExports, domesticValueAdded, foreignValueAdded } = request;
  const compute = (): Output => {
    H.domain(
      grossExports >= 0 && domesticValueAdded >= 0 && foreignValueAdded >= 0,
      "grossExports",
    );
    return {
      unassignedValue: grossExports - domesticValueAdded - foreignValueAdded,
      assignedShare:
        grossExports > 0
          ? (domesticValueAdded + foreignValueAdded) / grossExports
          : 0,
      defined: grossExports > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossExports: 100, domesticValueAdded: 60, foreignValueAdded: 30 },
  output: { unassignedValue: 10, assignedShare: 0.9, defined: true },
} satisfies ToolExample<Input, Output>;
export const exportDomesticForeignValueAddedPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "international-economics",
          "international economics",
          "economics",
        ],
        keywords: ["international economics", "economics"],
      },
      id: "international-economics/export-domestic-foreign-value-added-pair",
      title: "Export Domestic Foreign Value Added Pair",
      description:
        "Reconcile explicit domestic and foreign value-added allocations against gross exports without deriving input-output coefficients.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossExports: { type: "number", minimum: 0 },
          domesticValueAdded: { type: "number", minimum: 0 },
          foreignValueAdded: { type: "number", minimum: 0 },
        },
        required: ["grossExports", "domesticValueAdded", "foreignValueAdded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unassignedValue: { type: "number" },
          assignedShare: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["unassignedValue", "assignedShare", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "grossExports",
            label: "Gross Exports",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "domesticValueAdded",
            label: "Domestic Value Added",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foreignValueAdded",
            label: "Foreign Value Added",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unassignedValue",
            label: "Unassigned Value",
            valueType: { type: "number" },
          },
          {
            id: "assignedShare",
            label: "Assigned Share",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = exportDomesticForeignValueAddedPairTool.execute;
export default exportDomesticForeignValueAddedPairTool;

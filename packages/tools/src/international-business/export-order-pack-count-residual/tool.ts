import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedUnits: number;
  readonly fullPacks: number;
  readonly unitsPerPack: number;
  readonly looseUnits: number;
};
export type Output = {
  readonly packedUnits: number;
  readonly unitResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedUnits: { type: "integer", minimum: 0 },
    fullPacks: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
    looseUnits: { type: "integer", minimum: 0 },
  },
  required: ["orderedUnits", "fullPacks", "unitsPerPack", "looseUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packedUnits: { type: "integer" },
    unitResidual: { type: "integer" },
  },
  required: ["packedUnits", "unitResidual"],
} as const;
/** Reconcile explicit export-order units with full packs and a partial pack without rounding or enforcing shipping policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedUnits, fullPacks, unitsPerPack, looseUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(orderedUnits) &&
        orderedUnits >= 0 &&
        orderedUnits <= Number.MAX_SAFE_INTEGER,
      "orderedUnits",
    ),
      orderedUnits);
    (H.domain(
      Number.isSafeInteger(fullPacks) &&
        fullPacks >= 0 &&
        fullPacks <= Number.MAX_SAFE_INTEGER,
      "fullPacks",
    ),
      fullPacks);
    (H.domain(
      Number.isSafeInteger(unitsPerPack) &&
        unitsPerPack >= 1 &&
        unitsPerPack <= Number.MAX_SAFE_INTEGER,
      "unitsPerPack",
    ),
      unitsPerPack);
    (H.domain(
      Number.isSafeInteger(looseUnits) &&
        looseUnits >= 0 &&
        looseUnits <= unitsPerPack - 1,
      "looseUnits",
    ),
      looseUnits);
    return {
      packedUnits: fullPacks * unitsPerPack + looseUnits,
      unitResidual: orderedUnits - fullPacks * unitsPerPack - looseUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedUnits: 105, fullPacks: 10, unitsPerPack: 10, looseUnits: 3 },
  output: { packedUnits: 103, unitResidual: 2 },
} satisfies ToolExample<Input, Output>;
export const exportOrderPackCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/export-order-pack-count-residual",
    title: "Export Order Pack Count Residual",
    description:
      "Reconcile explicit export-order units with full packs and a partial pack without rounding or enforcing shipping policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedUnits: { type: "integer", minimum: 0 },
        fullPacks: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
        looseUnits: { type: "integer", minimum: 0 },
      },
      required: ["orderedUnits", "fullPacks", "unitsPerPack", "looseUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packedUnits: { type: "integer" },
        unitResidual: { type: "integer" },
      },
      required: ["packedUnits", "unitResidual"],
    },
    ports: {
      inputs: [
        {
          id: "orderedUnits",
          label: "Ordered Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fullPacks",
          label: "Full Packs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "packedUnits",
          label: "Packed Units",
          valueType: { type: "integer" },
        },
        {
          id: "unitResidual",
          label: "Unit Residual",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportOrderPackCountResidualTool.execute;
export default exportOrderPackCountResidualTool;

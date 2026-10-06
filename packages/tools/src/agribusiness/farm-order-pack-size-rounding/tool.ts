import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredUnits: number;
  readonly unitsPerPack: number;
};
export type Output = {
  readonly packCount: number;
  readonly orderedUnits: number;
  readonly surplusUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredUnits: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
  },
  required: ["requiredUnits", "unitsPerPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packCount: { type: "integer" },
    orderedUnits: { type: "integer" },
    surplusUnits: { type: "integer" },
  },
  required: ["packCount", "orderedUnits", "surplusUnits"],
} as const;
/** Round a farm order upward to whole packs of an explicitly supplied fixed size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredUnits, unitsPerPack } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requiredUnits) &&
        requiredUnits >= 0 &&
        requiredUnits <= Number.MAX_SAFE_INTEGER,
      "requiredUnits",
    ),
      requiredUnits);
    (H.domain(
      Number.isSafeInteger(unitsPerPack) &&
        unitsPerPack >= 1 &&
        unitsPerPack <= Number.MAX_SAFE_INTEGER,
      "unitsPerPack",
    ),
      unitsPerPack);
    return (() => {
      const packCount = Math.ceil(requiredUnits / unitsPerPack),
        orderedUnits = packCount * unitsPerPack;
      return {
        packCount,
        orderedUnits,
        surplusUnits: orderedUnits - requiredUnits,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredUnits: 103, unitsPerPack: 12 },
  output: { packCount: 9, orderedUnits: 108, surplusUnits: 5 },
} satisfies ToolExample<Input, Output>;
export const farmOrderPackSizeRoundingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-order-pack-size-rounding",
    title: "Farm Order Pack Size Rounding",
    description:
      "Round a farm order upward to whole packs of an explicitly supplied fixed size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredUnits: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
      },
      required: ["requiredUnits", "unitsPerPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packCount: { type: "integer" },
        orderedUnits: { type: "integer" },
        surplusUnits: { type: "integer" },
      },
      required: ["packCount", "orderedUnits", "surplusUnits"],
    },
    ports: {
      inputs: [
        {
          id: "requiredUnits",
          label: "Required Units",
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
          id: "packCount",
          label: "Pack Count",
          valueType: { type: "integer" },
        },
        {
          id: "orderedUnits",
          label: "Ordered Units",
          valueType: { type: "integer" },
        },
        {
          id: "surplusUnits",
          label: "Surplus Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmOrderPackSizeRoundingTool.execute;
export default farmOrderPackSizeRoundingTool;

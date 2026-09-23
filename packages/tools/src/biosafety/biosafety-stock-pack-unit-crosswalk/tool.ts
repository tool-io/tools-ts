import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cases: number;
  readonly packsPerCase: number;
  readonly unitsPerPack: number;
  readonly loosePacks: number;
  readonly looseUnits: number;
};
export type Output = {
  readonly totalPacks: number;
  readonly totalUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: { type: "integer", minimum: 0 },
    packsPerCase: { type: "integer", minimum: 1 },
    unitsPerPack: { type: "integer", minimum: 1 },
    loosePacks: { type: "integer", minimum: 0 },
    looseUnits: { type: "integer", minimum: 0 },
  },
  required: [
    "cases",
    "packsPerCase",
    "unitsPerPack",
    "loosePacks",
    "looseUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPacks: { type: "integer" },
    totalUnits: { type: "integer" },
  },
  required: ["totalPacks", "totalUnits"],
} as const;
/** Calculate biosafety stock pack unit crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cases, packsPerCase, unitsPerPack, loosePacks, looseUnits } = request;
  const compute = (): Output => {
    H.integer(cases, 0);
    H.integer(packsPerCase, 1);
    H.integer(unitsPerPack, 1);
    H.integer(loosePacks, 0, packsPerCase - 1);
    H.integer(looseUnits, 0, unitsPerPack - 1);
    return {
      totalPacks: cases * packsPerCase + loosePacks,
      totalUnits:
        (cases * packsPerCase + loosePacks) * unitsPerPack + looseUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cases: 3,
    packsPerCase: 4,
    unitsPerPack: 10,
    loosePacks: 2,
    looseUnits: 5,
  },
  output: { totalPacks: 14, totalUnits: 145 },
} satisfies ToolExample<Input, Output>;
export const biosafetyStockPackUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-stock-pack-unit-crosswalk",
    title: "Biosafety Stock Pack Unit Crosswalk Tool",
    description:
      "Calculate biosafety stock pack unit crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cases: { type: "integer", minimum: 0 },
        packsPerCase: { type: "integer", minimum: 1 },
        unitsPerPack: { type: "integer", minimum: 1 },
        loosePacks: { type: "integer", minimum: 0 },
        looseUnits: { type: "integer", minimum: 0 },
      },
      required: [
        "cases",
        "packsPerCase",
        "unitsPerPack",
        "loosePacks",
        "looseUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPacks: { type: "integer" },
        totalUnits: { type: "integer" },
      },
      required: ["totalPacks", "totalUnits"],
    },
    ports: {
      inputs: [
        {
          id: "cases",
          label: "Cases",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "packsPerCase",
          label: "Packs Per Case",
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
          id: "loosePacks",
          label: "Loose Packs",
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
          id: "totalPacks",
          label: "Total Packs",
          valueType: { type: "integer" },
        },
        {
          id: "totalUnits",
          label: "Total Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyStockPackUnitCrosswalkTool.execute;
export default biosafetyStockPackUnitCrosswalkTool;

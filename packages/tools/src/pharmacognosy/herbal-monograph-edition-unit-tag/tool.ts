import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monographId: string;
  readonly edition: string;
  readonly unit: string;
  readonly expectedEdition: string;
  readonly expectedUnit: string;
};
export type Output = {
  readonly editionMatches: boolean;
  readonly unitMatches: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monographId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
    expectedEdition: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "monographId",
    "edition",
    "unit",
    "expectedEdition",
    "expectedUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionMatches: { type: "boolean" },
    unitMatches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["editionMatches", "unitMatches", "key"],
} as const;
/** Retain supplied monograph edition and unit provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monographId, edition, unit, expectedEdition, expectedUnit } = request;
  const compute = (): Output => {
    H.domain(monographId.length > 0 && edition.length > 0 && unit.length > 0);
    return {
      editionMatches: edition === expectedEdition,
      unitMatches: unit === expectedUnit,
      key: JSON.stringify([monographId, edition, unit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    monographId: "M1",
    edition: "v2",
    unit: "mg/g",
    expectedEdition: "v2",
    expectedUnit: "mg/g",
  },
  output: {
    editionMatches: true,
    unitMatches: true,
    key: '["M1","v2","mg/g"]',
  },
} satisfies ToolExample<Input, Output>;
export const herbalMonographEditionUnitTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/herbal-monograph-edition-unit-tag",
    title: "Herbal Monograph Edition Unit Tag Tool",
    description: "Retain supplied monograph edition and unit provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monographId: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
        expectedEdition: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "monographId",
        "edition",
        "unit",
        "expectedEdition",
        "expectedUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionMatches: { type: "boolean" },
        unitMatches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["editionMatches", "unitMatches", "key"],
    },
    ports: {
      inputs: [
        {
          id: "monographId",
          label: "Monograph Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedEdition",
          label: "Expected Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "editionMatches",
          label: "Edition Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "unitMatches",
          label: "Unit Matches",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = herbalMonographEditionUnitTagTool.execute;
export default herbalMonographEditionUnitTagTool;

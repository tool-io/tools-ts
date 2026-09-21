import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headCounts: readonly number[];
  readonly suppliedUnitFactors: readonly number[];
  readonly usableArea: number;
};
export type Output = {
  readonly animalUnits: number;
  readonly unitsPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedUnitFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    usableArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["headCounts", "suppliedUnitFactors", "usableArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animalUnits: { type: "number" },
    unitsPerArea: { type: "number" },
  },
  required: ["animalUnits", "unitsPerArea"],
} as const;
/** Observed inventory density using supplied unit factors, without stocking recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headCounts, suppliedUnitFactors, usableArea } = request;
  const compute = (): Output => {
    H.sameLength(headCounts, suppliedUnitFactors);
    H.domain(
      headCounts.every((x) => x >= 0) &&
        suppliedUnitFactors.every((x) => x >= 0),
    );
    H.positive(usableArea);
    return {
      animalUnits: H.dot(headCounts, suppliedUnitFactors),
      unitsPerArea: H.dot(headCounts, suppliedUnitFactors) / usableArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    headCounts: [10, 20],
    suppliedUnitFactors: [1, 0.2],
    usableArea: 20,
  },
  output: { animalUnits: 14, unitsPerArea: 0.7 },
} satisfies ToolExample<Input, Output>;
export const silvopastureAnimalUnitAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/silvopasture-animal-unit-area-factor",
    title: "Silvopasture Animal Unit Area Factor Tool",
    description:
      "Observed inventory density using supplied unit factors, without stocking recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        suppliedUnitFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        usableArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["headCounts", "suppliedUnitFactors", "usableArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animalUnits: { type: "number" },
        unitsPerArea: { type: "number" },
      },
      required: ["animalUnits", "unitsPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "headCounts",
          label: "Head Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedUnitFactors",
          label: "Supplied Unit Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "usableArea",
          label: "Usable Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "animalUnits",
          label: "Animal Units",
          valueType: { type: "number" },
        },
        {
          id: "unitsPerArea",
          label: "Units Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = silvopastureAnimalUnitAreaFactorTool.execute;
export default silvopastureAnimalUnitAreaFactorTool;

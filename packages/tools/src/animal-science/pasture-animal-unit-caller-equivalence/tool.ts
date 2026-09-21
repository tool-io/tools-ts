import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly equivalences: readonly number[];
  readonly area: number;
};
export type Output = {
  readonly animalUnits: number;
  readonly unitsPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    equivalences: { type: "array", maxItems: 256, items: { type: "number" } },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["counts", "equivalences", "area"],
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
/** Sum explicit caller-supplied animal-unit equivalents, without selecting grazing capacity or husbandry rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, equivalences, area } = request;
  const compute = (): Output => {
    H.sameLength(counts, equivalences);
    H.domain(counts.every((x) => x >= 0) && equivalences.every((x) => x >= 0));
    H.positive(area);
    return {
      animalUnits: H.dot(counts, equivalences),
      unitsPerArea: H.dot(counts, equivalences) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [10, 20], equivalences: [1, 0.5], area: 10 },
  output: { animalUnits: 20, unitsPerArea: 2 },
} satisfies ToolExample<Input, Output>;
export const pastureAnimalUnitCallerEquivalenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/pasture-animal-unit-caller-equivalence",
    title: "Pasture Animal Unit Caller Equivalence Tool",
    description:
      "Sum explicit caller-supplied animal-unit equivalents, without selecting grazing capacity or husbandry rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        equivalences: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["counts", "equivalences", "area"],
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
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "equivalences",
          label: "Equivalences",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "area",
          label: "Area",
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
export const run = pastureAnimalUnitCallerEquivalenceTool.execute;
export default pastureAnimalUnitCallerEquivalenceTool;

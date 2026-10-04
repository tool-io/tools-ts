import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossOpenSpace: number;
  readonly excludedArea: number;
  readonly population: number;
};
export type Output = {
  readonly usableArea: number;
  readonly areaPerPerson: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossOpenSpace: { type: "number" },
    excludedArea: { type: "number", minimum: 0 },
    population: { type: "integer", minimum: 1 },
  },
  required: ["grossOpenSpace", "excludedArea", "population"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableArea: { type: "number" },
    areaPerPerson: { type: "number" },
  },
  required: ["usableArea", "areaPerPerson"],
} as const;
/** Calculate public open space per person term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossOpenSpace, excludedArea, population } = request;
  const compute = (): Output => {
    H.integer(population, 1);
    H.domain(excludedArea >= 0 && grossOpenSpace >= excludedArea);
    return {
      usableArea: grossOpenSpace - excludedArea,
      areaPerPerson: (grossOpenSpace - excludedArea) / population,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossOpenSpace: 12000, excludedArea: 2000, population: 1000 },
  output: { usableArea: 10000, areaPerPerson: 10 },
} satisfies ToolExample<Input, Output>;
export const publicOpenSpacePerPersonTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/public-open-space-per-person-term",
    title: "Public Open Space Per Person Term Tool",
    description:
      "Calculate public open space per person term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossOpenSpace: { type: "number" },
        excludedArea: { type: "number", minimum: 0 },
        population: { type: "integer", minimum: 1 },
      },
      required: ["grossOpenSpace", "excludedArea", "population"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        areaPerPerson: { type: "number" },
      },
      required: ["usableArea", "areaPerPerson"],
    },
    ports: {
      inputs: [
        {
          id: "grossOpenSpace",
          label: "Gross Open Space",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        {
          id: "areaPerPerson",
          label: "Area Per Person",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicOpenSpacePerPersonTermTool.execute;
export default publicOpenSpacePerPersonTermTool;

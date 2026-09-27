import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generations: number;
  readonly generationYears: number;
  readonly generationUncertainty: number;
};
export type Output = {
  readonly years: number;
  readonly minimumYears: number;
  readonly maximumYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generations: { type: "number", minimum: 0 },
    generationYears: { type: "number", exclusiveMinimum: 0 },
    generationUncertainty: { type: "number", minimum: 0 },
  },
  required: ["generations", "generationYears", "generationUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    years: { type: "number" },
    minimumYears: { type: "number" },
    maximumYears: { type: "number" },
  },
  required: ["years", "minimumYears", "maximumYears"],
} as const;
/** Calculate allele age generations year crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generations, generationYears, generationUncertainty } = request;
  const compute = (): Output => {
    H.domain(
      generations >= 0 &&
        generationYears > 0 &&
        generationUncertainty >= 0 &&
        generationUncertainty <= generationYears,
    );
    return {
      years: generations * generationYears,
      minimumYears: generations * (generationYears - generationUncertainty),
      maximumYears: generations * (generationYears + generationUncertainty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generations: 100, generationYears: 25, generationUncertainty: 5 },
  output: { years: 2500, minimumYears: 2000, maximumYears: 3000 },
} satisfies ToolExample<Input, Output>;
export const alleleAgeGenerationsYearCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/allele-age-generations-year-crosswalk",
    title: "Allele Age Generations Year Crosswalk Tool",
    description:
      "Calculate allele age generations year crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generations: { type: "number", minimum: 0 },
        generationYears: { type: "number", exclusiveMinimum: 0 },
        generationUncertainty: { type: "number", minimum: 0 },
      },
      required: ["generations", "generationYears", "generationUncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        years: { type: "number" },
        minimumYears: { type: "number" },
        maximumYears: { type: "number" },
      },
      required: ["years", "minimumYears", "maximumYears"],
    },
    ports: {
      inputs: [
        {
          id: "generations",
          label: "Generations",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "generationYears",
          label: "Generation Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "generationUncertainty",
          label: "Generation Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "years", label: "Years", valueType: { type: "number" } },
        {
          id: "minimumYears",
          label: "Minimum Years",
          valueType: { type: "number" },
        },
        {
          id: "maximumYears",
          label: "Maximum Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleleAgeGenerationsYearCrosswalkTool.execute;
export default alleleAgeGenerationsYearCrosswalkTool;

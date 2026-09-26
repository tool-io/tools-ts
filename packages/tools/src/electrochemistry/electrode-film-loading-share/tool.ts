import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly filmMass: number;
  readonly exposedArea: number;
  readonly binderMassFraction: number;
};
export type Output = {
  readonly totalArealLoading: number;
  readonly activeArealLoading: number;
  readonly binderArealLoading: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filmMass: { type: "number", minimum: 0 },
    exposedArea: { type: "number", exclusiveMinimum: 0 },
    binderMassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["filmMass", "exposedArea", "binderMassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArealLoading: { type: "number" },
    activeArealLoading: { type: "number" },
    binderArealLoading: { type: "number" },
  },
  required: ["totalArealLoading", "activeArealLoading", "binderArealLoading"],
} as const;
/** Calculate electrode film loading share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filmMass, exposedArea, binderMassFraction } = request;
  const compute = (): Output => {
    H.domain(filmMass >= 0);
    H.positive(exposedArea);
    H.probability(binderMassFraction);
    return {
      totalArealLoading: filmMass / exposedArea,
      activeArealLoading: (filmMass / exposedArea) * (1 - binderMassFraction),
      binderArealLoading: (filmMass / exposedArea) * binderMassFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { filmMass: 10, exposedArea: 2, binderMassFraction: 0.2 },
  output: {
    totalArealLoading: 5,
    activeArealLoading: 4,
    binderArealLoading: 1,
  },
} satisfies ToolExample<Input, Output>;
export const electrodeFilmLoadingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-film-loading-share",
    title: "Electrode Film Loading Share Tool",
    description:
      "Calculate electrode film loading share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filmMass: { type: "number", minimum: 0 },
        exposedArea: { type: "number", exclusiveMinimum: 0 },
        binderMassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["filmMass", "exposedArea", "binderMassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArealLoading: { type: "number" },
        activeArealLoading: { type: "number" },
        binderArealLoading: { type: "number" },
      },
      required: [
        "totalArealLoading",
        "activeArealLoading",
        "binderArealLoading",
      ],
    },
    ports: {
      inputs: [
        {
          id: "filmMass",
          label: "Film Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposedArea",
          label: "Exposed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binderMassFraction",
          label: "Binder Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalArealLoading",
          label: "Total Areal Loading",
          valueType: { type: "number" },
        },
        {
          id: "activeArealLoading",
          label: "Active Areal Loading",
          valueType: { type: "number" },
        },
        {
          id: "binderArealLoading",
          label: "Binder Areal Loading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrodeFilmLoadingShareTool.execute;
export default electrodeFilmLoadingShareTool;

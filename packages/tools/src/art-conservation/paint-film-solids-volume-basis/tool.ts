import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetVolume: number;
  readonly solidsFraction: number;
  readonly retainedFraction: number;
  readonly area: number;
};
export type Output = {
  readonly solidVolume: number;
  readonly dryThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetVolume: { type: "number", minimum: 0 },
    solidsFraction: { type: "number", minimum: 0, maximum: 1 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetVolume", "solidsFraction", "retainedFraction", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidVolume: { type: "number" },
    dryThickness: { type: "number" },
  },
  required: ["solidVolume", "dryThickness"],
} as const;
/** Calculate paint film solids volume basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetVolume, solidsFraction, retainedFraction, area } = request;
  const compute = (): Output => {
    H.domain(wetVolume >= 0);
    H.probability(solidsFraction);
    H.probability(retainedFraction);
    H.positive(area);
    return {
      solidVolume: wetVolume * solidsFraction * retainedFraction,
      dryThickness: (wetVolume * solidsFraction * retainedFraction) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetVolume: 100,
    solidsFraction: 0.4,
    retainedFraction: 0.8,
    area: 20,
  },
  output: { solidVolume: 32, dryThickness: 1.6 },
} satisfies ToolExample<Input, Output>;
export const paintFilmSolidsVolumeBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/paint-film-solids-volume-basis",
    title: "Paint Film Solids Volume Basis Tool",
    description:
      "Calculate paint film solids volume basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetVolume: { type: "number", minimum: 0 },
        solidsFraction: { type: "number", minimum: 0, maximum: 1 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetVolume", "solidsFraction", "retainedFraction", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidVolume: { type: "number" },
        dryThickness: { type: "number" },
      },
      required: ["solidVolume", "dryThickness"],
    },
    ports: {
      inputs: [
        {
          id: "wetVolume",
          label: "Wet Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidsFraction",
          label: "Solids Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
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
          id: "solidVolume",
          label: "Solid Volume",
          valueType: { type: "number" },
        },
        {
          id: "dryThickness",
          label: "Dry Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paintFilmSolidsVolumeBasisTool.execute;
export default paintFilmSolidsVolumeBasisTool;

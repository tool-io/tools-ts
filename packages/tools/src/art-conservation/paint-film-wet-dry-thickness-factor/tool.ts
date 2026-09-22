import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetThickness: number;
  readonly solidsVolumeFraction: number;
  readonly area: number;
};
export type Output = {
  readonly dryThickness: number;
  readonly solidsVolume: number;
  readonly lostVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetThickness: { type: "number", minimum: 0 },
    solidsVolumeFraction: { type: "number", minimum: 0, maximum: 1 },
    area: { type: "number", minimum: 0 },
  },
  required: ["wetThickness", "solidsVolumeFraction", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryThickness: { type: "number" },
    solidsVolume: { type: "number" },
    lostVolume: { type: "number" },
  },
  required: ["dryThickness", "solidsVolume", "lostVolume"],
} as const;
/** Uniform constant-area film with all nonsolids volume lost and solids volume retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetThickness, solidsVolumeFraction, area } = request;
  const compute = (): Output => {
    H.domain(wetThickness >= 0 && area >= 0);
    H.probability(solidsVolumeFraction);
    return {
      dryThickness: wetThickness * solidsVolumeFraction,
      solidsVolume: wetThickness * solidsVolumeFraction * area,
      lostVolume: wetThickness * (1 - solidsVolumeFraction) * area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetThickness: 0.1, solidsVolumeFraction: 0.6, area: 100 },
  output: {
    dryThickness: 0.06,
    solidsVolume: 6,
    lostVolume: 4.000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const paintFilmWetDryThicknessFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/paint-film-wet-dry-thickness-factor",
    title: "Paint Film Wet Dry Thickness Factor Tool",
    description:
      "Uniform constant-area film with all nonsolids volume lost and solids volume retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetThickness: { type: "number", minimum: 0 },
        solidsVolumeFraction: { type: "number", minimum: 0, maximum: 1 },
        area: { type: "number", minimum: 0 },
      },
      required: ["wetThickness", "solidsVolumeFraction", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryThickness: { type: "number" },
        solidsVolume: { type: "number" },
        lostVolume: { type: "number" },
      },
      required: ["dryThickness", "solidsVolume", "lostVolume"],
    },
    ports: {
      inputs: [
        {
          id: "wetThickness",
          label: "Wet Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidsVolumeFraction",
          label: "Solids Volume Fraction",
          required: true,
          valueType: { type: "number" },
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
          id: "dryThickness",
          label: "Dry Thickness",
          valueType: { type: "number" },
        },
        {
          id: "solidsVolume",
          label: "Solids Volume",
          valueType: { type: "number" },
        },
        {
          id: "lostVolume",
          label: "Lost Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paintFilmWetDryThicknessFactorTool.execute;
export default paintFilmWetDryThicknessFactorTool;

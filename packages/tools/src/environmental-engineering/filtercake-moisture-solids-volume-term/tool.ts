import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moistureFraction: number;
  readonly solidDensity: number;
  readonly waterDensity: number;
};
export type Output = {
  readonly dryMass: number;
  readonly waterMass: number;
  readonly componentVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
    solidDensity: { type: "number", exclusiveMinimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetMass", "moistureFraction", "solidDensity", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    waterMass: { type: "number" },
    componentVolume: { type: "number" },
  },
  required: ["dryMass", "waterMass", "componentVolume"],
} as const;
/** Additive solid and water component volume, excluding trapped air and volume contraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moistureFraction, solidDensity, waterDensity } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(moistureFraction);
    H.positive(solidDensity);
    H.positive(waterDensity);
    return {
      dryMass: wetMass * (1 - moistureFraction),
      waterMass: wetMass * moistureFraction,
      componentVolume:
        (wetMass * (1 - moistureFraction)) / solidDensity +
        (wetMass * moistureFraction) / waterDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    moistureFraction: 0.6,
    solidDensity: 2000,
    waterDensity: 1000,
  },
  output: { dryMass: 40, waterMass: 60, componentVolume: 0.08 },
} satisfies ToolExample<Input, Output>;
export const filtercakeMoistureSolidsVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/filtercake-moisture-solids-volume-term",
    title: "Filtercake Moisture Solids Volume Term Tool",
    description:
      "Additive solid and water component volume, excluding trapped air and volume contraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
        solidDensity: { type: "number", exclusiveMinimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetMass", "moistureFraction", "solidDensity", "waterDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        waterMass: { type: "number" },
        componentVolume: { type: "number" },
      },
      required: ["dryMass", "waterMass", "componentVolume"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidDensity",
          label: "Solid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        {
          id: "componentVolume",
          label: "Component Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = filtercakeMoistureSolidsVolumeTermTool.execute;
export default filtercakeMoistureSolidsVolumeTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerDiameter: number;
  readonly shaftDiameter: number;
  readonly pitch: number;
  readonly fillFraction: number;
};
export type Output = { readonly volumePerRevolution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerDiameter: { type: "number" },
    shaftDiameter: { type: "number", minimum: 0 },
    pitch: { type: "number", minimum: 0 },
    fillFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["outerDiameter", "shaftDiameter", "pitch", "fillFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumePerRevolution: { type: "number" } },
  required: ["volumePerRevolution"],
} as const;
/** Calculate farm auger volume per revolution term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerDiameter, shaftDiameter, pitch, fillFraction } = request;
  const compute = (): Output => {
    H.domain(
      outerDiameter >= shaftDiameter && shaftDiameter >= 0 && pitch >= 0,
    );
    H.probability(fillFraction);
    return {
      volumePerRevolution:
        (Math.PI *
          (outerDiameter ** 2 - shaftDiameter ** 2) *
          pitch *
          fillFraction) /
        4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outerDiameter: 0.2,
    shaftDiameter: 0.1,
    pitch: 0.1,
    fillFraction: 0.5,
  },
  output: { volumePerRevolution: 0.0011780972450961729 },
} satisfies ToolExample<Input, Output>;
export const farmAugerVolumePerRevolutionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/farm-auger-volume-per-revolution-term",
    title: "Farm Auger Volume Per Revolution Term Tool",
    description:
      "Calculate farm auger volume per revolution term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerDiameter: { type: "number" },
        shaftDiameter: { type: "number", minimum: 0 },
        pitch: { type: "number", minimum: 0 },
        fillFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["outerDiameter", "shaftDiameter", "pitch", "fillFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumePerRevolution: { type: "number" } },
      required: ["volumePerRevolution"],
    },
    ports: {
      inputs: [
        {
          id: "outerDiameter",
          label: "Outer Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shaftDiameter",
          label: "Shaft Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fillFraction",
          label: "Fill Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "volumePerRevolution",
          label: "Volume Per Revolution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmAugerVolumePerRevolutionTermTool.execute;
export default farmAugerVolumePerRevolutionTermTool;

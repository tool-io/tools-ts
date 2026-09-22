import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly wetMass: number;
  readonly surfaceWaterEstimate: number;
};
export type Output = {
  readonly absorbedMass: number;
  readonly absorptionPerDryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", exclusiveMinimum: 0 },
    wetMass: { type: "number" },
    surfaceWaterEstimate: { type: "number", minimum: 0 },
  },
  required: ["dryMass", "wetMass", "surfaceWaterEstimate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absorbedMass: { type: "number" },
    absorptionPerDryMass: { type: "number" },
  },
  required: ["absorbedMass", "absorptionPerDryMass"],
} as const;
/** Calculate watercolor class paper soak mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, wetMass, surfaceWaterEstimate } = request;
  const compute = (): Output => {
    H.positive(dryMass);
    H.domain(
      surfaceWaterEstimate >= 0 && wetMass >= dryMass + surfaceWaterEstimate,
    );
    return {
      absorbedMass: wetMass - dryMass - surfaceWaterEstimate,
      absorptionPerDryMass:
        (wetMass - dryMass - surfaceWaterEstimate) / dryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 100, wetMass: 180, surfaceWaterEstimate: 20 },
  output: { absorbedMass: 60, absorptionPerDryMass: 0.6 },
} satisfies ToolExample<Input, Output>;
export const watercolorClassPaperSoakMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/watercolor-class-paper-soak-mass-term",
    title: "Watercolor Class Paper Soak Mass Term Tool",
    description:
      "Calculate watercolor class paper soak mass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", exclusiveMinimum: 0 },
        wetMass: { type: "number" },
        surfaceWaterEstimate: { type: "number", minimum: 0 },
      },
      required: ["dryMass", "wetMass", "surfaceWaterEstimate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absorbedMass: { type: "number" },
        absorptionPerDryMass: { type: "number" },
      },
      required: ["absorbedMass", "absorptionPerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surfaceWaterEstimate",
          label: "Surface Water Estimate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absorbedMass",
          label: "Absorbed Mass",
          valueType: { type: "number" },
        },
        {
          id: "absorptionPerDryMass",
          label: "Absorption Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = watercolorClassPaperSoakMassTermTool.execute;
export default watercolorClassPaperSoakMassTermTool;

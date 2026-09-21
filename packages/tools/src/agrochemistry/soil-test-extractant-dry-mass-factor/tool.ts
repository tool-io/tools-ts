import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly extractVolume: number;
  readonly wetSample: number;
  readonly moisture: number;
};
export type Output = { readonly massPerDryMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number" },
    extractVolume: { type: "number", minimum: 0 },
    wetSample: { type: "number", exclusiveMinimum: 0 },
    moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["concentration", "extractVolume", "wetSample", "moisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerDryMass: { type: "number" } },
  required: ["massPerDryMass"],
} as const;
/** Calculate soil test extractant dry mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, extractVolume, wetSample, moisture } = request;
  const compute = (): Output => {
    H.positive(wetSample);
    H.domain(extractVolume >= 0 && moisture >= 0 && moisture < 1);
    return {
      massPerDryMass:
        (concentration * extractVolume) / (wetSample * (1 - moisture)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, extractVolume: 50, wetSample: 10, moisture: 0.2 },
  output: { massPerDryMass: 12.5 },
} satisfies ToolExample<Input, Output>;
export const soilTestExtractantDryMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/soil-test-extractant-dry-mass-factor",
    title: "Soil Test Extractant Dry Mass Factor Tool",
    description:
      "Calculate soil test extractant dry mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number" },
        extractVolume: { type: "number", minimum: 0 },
        wetSample: { type: "number", exclusiveMinimum: 0 },
        moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["concentration", "extractVolume", "wetSample", "moisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerDryMass: { type: "number" } },
      required: ["massPerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extractVolume",
          label: "Extract Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetSample",
          label: "Wet Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerDryMass",
          label: "Mass Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilTestExtractantDryMassFactorTool.execute;
export default soilTestExtractantDryMassFactorTool;

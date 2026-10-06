import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samplePressure: number;
  readonly finalPressure: number;
  readonly diluentBackgroundConcentration: number;
  readonly measuredConcentration: number;
};
export type Output = {
  readonly sampleFraction: number;
  readonly originalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePressure: { type: "number", exclusiveMinimum: 0 },
    finalPressure: { type: "number" },
    diluentBackgroundConcentration: { type: "number", minimum: 0 },
    measuredConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "samplePressure",
    "finalPressure",
    "diluentBackgroundConcentration",
    "measuredConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleFraction: { type: "number" },
    originalConcentration: { type: "number" },
  },
  required: ["sampleFraction", "originalConcentration"],
} as const;
/** Back-calculate a canister sample concentration from an explicit ideal-gas pressure dilution at constant volume and temperature, including diluent background. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    samplePressure,
    finalPressure,
    diluentBackgroundConcentration,
    measuredConcentration,
  } = request;
  const compute = (): Output => {
    (H.domain(samplePressure > 0, "samplePressure"), samplePressure);
    H.domain(
      finalPressure >= samplePressure &&
        diluentBackgroundConcentration >= 0 &&
        measuredConcentration >= 0,
      "finalPressure",
    );
    return (() => {
      const sampleFraction = samplePressure / finalPressure;
      return {
        sampleFraction,
        originalConcentration:
          (measuredConcentration -
            (1 - sampleFraction) * diluentBackgroundConcentration) /
          sampleFraction,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    samplePressure: 20,
    finalPressure: 100,
    diluentBackgroundConcentration: 0,
    measuredConcentration: 4,
  },
  output: { sampleFraction: 0.2, originalConcentration: 20 },
} satisfies ToolExample<Input, Output>;
export const canisterDilutionFactorCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/canister-dilution-factor-crosswalk",
    title: "Canister Dilution Factor Crosswalk",
    description:
      "Back-calculate a canister sample concentration from an explicit ideal-gas pressure dilution at constant volume and temperature, including diluent background.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samplePressure: { type: "number", exclusiveMinimum: 0 },
        finalPressure: { type: "number" },
        diluentBackgroundConcentration: { type: "number", minimum: 0 },
        measuredConcentration: { type: "number", minimum: 0 },
      },
      required: [
        "samplePressure",
        "finalPressure",
        "diluentBackgroundConcentration",
        "measuredConcentration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleFraction: { type: "number" },
        originalConcentration: { type: "number" },
      },
      required: ["sampleFraction", "originalConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "samplePressure",
          label: "Sample Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalPressure",
          label: "Final Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diluentBackgroundConcentration",
          label: "Diluent Background Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredConcentration",
          label: "Measured Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleFraction",
          label: "Sample Fraction",
          valueType: { type: "number" },
        },
        {
          id: "originalConcentration",
          label: "Original Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canisterDilutionFactorCrosswalkTool.execute;
export default canisterDilutionFactorCrosswalkTool;

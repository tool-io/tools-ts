import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly springConstantNewtonsPerMeter: number;
  readonly initialExtensionMeters: number;
  readonly finalExtensionMeters: number;
};
export type Output = { readonly energyChangeJoules: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    springConstantNewtonsPerMeter: { type: "number", minimum: 0 },
    initialExtensionMeters: { type: "number" },
    finalExtensionMeters: { type: "number" },
  },
  required: [
    "springConstantNewtonsPerMeter",
    "initialExtensionMeters",
    "finalExtensionMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyChangeJoules: { type: "number" } },
  required: ["energyChangeJoules"],
} as const;
/** Calculate the signed change in ideal linear spring potential from explicit extensions about the same unstretched reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    springConstantNewtonsPerMeter,
    initialExtensionMeters,
    finalExtensionMeters,
  } = request;
  const compute = (): Output => {
    H.domain(
      springConstantNewtonsPerMeter >= 0,
      "springConstantNewtonsPerMeter",
    );
    return {
      energyChangeJoules:
        0.5 *
        springConstantNewtonsPerMeter *
        (finalExtensionMeters - initialExtensionMeters) *
        (finalExtensionMeters + initialExtensionMeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    springConstantNewtonsPerMeter: 100,
    initialExtensionMeters: 0.1,
    finalExtensionMeters: 0.2,
  },
  output: { energyChangeJoules: 1.5000000000000002 },
} satisfies ToolExample<Input, Output>;
export const elasticPotentialPreloadEnergyDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["physics"],
        keywords: ["physics"],
      },
      id: "physics/elastic-potential-preload-energy-difference",
      title: "Elastic Potential Preload Energy Difference",
      description:
        "Calculate the signed change in ideal linear spring potential from explicit extensions about the same unstretched reference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          springConstantNewtonsPerMeter: { type: "number", minimum: 0 },
          initialExtensionMeters: { type: "number" },
          finalExtensionMeters: { type: "number" },
        },
        required: [
          "springConstantNewtonsPerMeter",
          "initialExtensionMeters",
          "finalExtensionMeters",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { energyChangeJoules: { type: "number" } },
        required: ["energyChangeJoules"],
      },
      ports: {
        inputs: [
          {
            id: "springConstantNewtonsPerMeter",
            label: "Spring Constant Newtons Per Meter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialExtensionMeters",
            label: "Initial Extension Meters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalExtensionMeters",
            label: "Final Extension Meters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "energyChangeJoules",
            label: "Energy Change Joules",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = elasticPotentialPreloadEnergyDifferenceTool.execute;
export default elasticPotentialPreloadEnergyDifferenceTool;

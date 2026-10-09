import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampledArea: number;
  readonly suppliedRepresentedArea: number;
};
export type Output = { readonly representedPerSampleFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledArea: { type: "number", exclusiveMinimum: 0 },
    suppliedRepresentedArea: { type: "number", minimum: 0 },
  },
  required: ["sampledArea", "suppliedRepresentedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { representedPerSampleFactor: { type: "number" } },
  required: ["representedPerSampleFactor"],
} as const;
/** Calculate an explicit represented-area per sampled-area expansion factor without establishing representativeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampledArea, suppliedRepresentedArea } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(sampledArea) && sampledArea > 0, "sampledArea"),
      sampledArea);
    H.domain(suppliedRepresentedArea >= 0, "suppliedRepresentedArea");
    return {
      representedPerSampleFactor: suppliedRepresentedArea / sampledArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampledArea: 2, suppliedRepresentedArea: 50 },
  output: { representedPerSampleFactor: 25 },
} satisfies ToolExample<Input, Output>;
export const ecologicalSampleRepresentedAreaFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/ecological-sample-represented-area-factor",
      title: "Ecological Sample Represented Area Factor",
      description:
        "Calculate an explicit represented-area per sampled-area expansion factor without establishing representativeness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampledArea: { type: "number", exclusiveMinimum: 0 },
          suppliedRepresentedArea: { type: "number", minimum: 0 },
        },
        required: ["sampledArea", "suppliedRepresentedArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { representedPerSampleFactor: { type: "number" } },
        required: ["representedPerSampleFactor"],
      },
      ports: {
        inputs: [
          {
            id: "sampledArea",
            label: "Sampled Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRepresentedArea",
            label: "Supplied Represented Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "representedPerSampleFactor",
            label: "Represented Per Sample Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalSampleRepresentedAreaFactorTool.execute;
export default ecologicalSampleRepresentedAreaFactorTool;

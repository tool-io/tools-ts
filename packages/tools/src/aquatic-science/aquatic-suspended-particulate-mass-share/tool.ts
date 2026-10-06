import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly particulateMass: number;
  readonly sampleMass: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    particulateMass: { type: "number", minimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["particulateMass", "sampleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied aquatic particulate mass fraction and non-particulate remainder on the same mass basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { particulateMass, sampleMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(sampleMass) && sampleMass > 0, "sampleMass"),
      sampleMass);
    H.domain(
      particulateMass >= 0 && particulateMass <= sampleMass,
      "particulateMass",
    );
    return {
      fraction: particulateMass / sampleMass,
      remainder: sampleMass - particulateMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { particulateMass: 30, sampleMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const aquaticSuspendedParticulateMassShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "aquatic-science",
          "aquatic science",
          "earth and environmental sciences",
        ],
        keywords: ["aquatic science", "earth and environmental sciences"],
      },
      id: "aquatic-science/aquatic-suspended-particulate-mass-share",
      title: "Aquatic Suspended Particulate Mass Share",
      description:
        "Calculate a supplied aquatic particulate mass fraction and non-particulate remainder on the same mass basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          particulateMass: { type: "number", minimum: 0 },
          sampleMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["particulateMass", "sampleMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "particulateMass",
            label: "Particulate Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleMass",
            label: "Sample Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaticSuspendedParticulateMassShareTool.execute;
export default aquaticSuspendedParticulateMassShareTool;

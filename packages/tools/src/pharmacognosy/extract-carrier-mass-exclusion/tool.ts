import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly carrierMass: number;
  readonly tareMass: number;
  readonly excludeCarrier: boolean;
};
export type Output = {
  readonly reportedMass: number;
  readonly carrierFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    carrierMass: { type: "number", minimum: 0 },
    tareMass: { type: "number", minimum: 0 },
    excludeCarrier: { type: "boolean" },
  },
  required: ["grossMass", "carrierMass", "tareMass", "excludeCarrier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedMass: { type: "number" },
    carrierFraction: { type: "number" },
  },
  required: ["reportedMass", "carrierFraction"],
} as const;
/** Supplied extract/carrier ledger arithmetic without preparation instructions or therapeutic claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, carrierMass, tareMass, excludeCarrier } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        carrierMass >= 0 &&
        tareMass >= 0 &&
        carrierMass + tareMass <= grossMass,
    );
    return {
      reportedMass: grossMass - tareMass - (excludeCarrier ? carrierMass : 0),
      carrierFraction:
        grossMass > tareMass ? carrierMass / (grossMass - tareMass) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 120,
    carrierMass: 30,
    tareMass: 20,
    excludeCarrier: true,
  },
  output: { reportedMass: 70, carrierFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const extractCarrierMassExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/extract-carrier-mass-exclusion",
    title: "Extract Carrier Mass Exclusion Tool",
    description:
      "Supplied extract/carrier ledger arithmetic without preparation instructions or therapeutic claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        carrierMass: { type: "number", minimum: 0 },
        tareMass: { type: "number", minimum: 0 },
        excludeCarrier: { type: "boolean" },
      },
      required: ["grossMass", "carrierMass", "tareMass", "excludeCarrier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedMass: { type: "number" },
        carrierFraction: { type: "number" },
      },
      required: ["reportedMass", "carrierFraction"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carrierMass",
          label: "Carrier Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeCarrier",
          label: "Exclude Carrier",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedMass",
          label: "Reported Mass",
          valueType: { type: "number" },
        },
        {
          id: "carrierFraction",
          label: "Carrier Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extractCarrierMassExclusionTool.execute;
export default extractCarrierMassExclusionTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finishedMass: number;
  readonly carrierFraction: number;
  readonly waterFraction: number;
  readonly declaredNativeMass: number;
};
export type Output = {
  readonly nativeMass: number;
  readonly carrierMass: number;
  readonly nativeDiscrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedMass: { type: "number", minimum: 0 },
    carrierFraction: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0 },
    declaredNativeMass: { type: "number", minimum: 0 },
  },
  required: [
    "finishedMass",
    "carrierFraction",
    "waterFraction",
    "declaredNativeMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nativeMass: { type: "number" },
    carrierMass: { type: "number" },
    nativeDiscrepancy: { type: "number" },
  },
  required: ["nativeMass", "carrierMass", "nativeDiscrepancy"],
} as const;
/** Calculate botanical extract carrier mass deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finishedMass, carrierFraction, waterFraction, declaredNativeMass } =
    request;
  const compute = (): Output => {
    H.domain(
      finishedMass >= 0 &&
        carrierFraction >= 0 &&
        waterFraction >= 0 &&
        carrierFraction + waterFraction <= 1 &&
        declaredNativeMass >= 0,
    );
    return {
      nativeMass: finishedMass * (1 - carrierFraction - waterFraction),
      carrierMass: finishedMass * carrierFraction,
      nativeDiscrepancy:
        finishedMass * (1 - carrierFraction - waterFraction) -
        declaredNativeMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    finishedMass: 100,
    carrierFraction: 0.2,
    waterFraction: 0.1,
    declaredNativeMass: 68,
  },
  output: { nativeMass: 70, carrierMass: 20, nativeDiscrepancy: 2 },
} satisfies ToolExample<Input, Output>;
export const botanicalExtractCarrierMassDeductionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/botanical-extract-carrier-mass-deduction",
      title: "Botanical Extract Carrier Mass Deduction Tool",
      description:
        "Calculate botanical extract carrier mass deduction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finishedMass: { type: "number", minimum: 0 },
          carrierFraction: { type: "number", minimum: 0 },
          waterFraction: { type: "number", minimum: 0 },
          declaredNativeMass: { type: "number", minimum: 0 },
        },
        required: [
          "finishedMass",
          "carrierFraction",
          "waterFraction",
          "declaredNativeMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nativeMass: { type: "number" },
          carrierMass: { type: "number" },
          nativeDiscrepancy: { type: "number" },
        },
        required: ["nativeMass", "carrierMass", "nativeDiscrepancy"],
      },
      ports: {
        inputs: [
          {
            id: "finishedMass",
            label: "Finished Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "carrierFraction",
            label: "Carrier Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterFraction",
            label: "Water Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "declaredNativeMass",
            label: "Declared Native Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nativeMass",
            label: "Native Mass",
            valueType: { type: "number" },
          },
          {
            id: "carrierMass",
            label: "Carrier Mass",
            valueType: { type: "number" },
          },
          {
            id: "nativeDiscrepancy",
            label: "Native Discrepancy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = botanicalExtractCarrierMassDeductionTool.execute;
export default botanicalExtractCarrierMassDeductionTool;

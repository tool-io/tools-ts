import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startingDryMass: number;
  readonly nativeExtractMass: number;
  readonly carrierMass: number;
};
export type Output = {
  readonly nativeDer: number;
  readonly finishedExtractMass: number;
  readonly finishedDer: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startingDryMass: { type: "number", minimum: 0 },
    nativeExtractMass: { type: "number", exclusiveMinimum: 0 },
    carrierMass: { type: "number", minimum: 0 },
  },
  required: ["startingDryMass", "nativeExtractMass", "carrierMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nativeDer: { type: "number" },
    finishedExtractMass: { type: "number" },
    finishedDer: { type: "number" },
  },
  required: ["nativeDer", "finishedExtractMass", "finishedDer"],
} as const;
/** Distinguish supplied native and carrier-containing extract mass ratios. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startingDryMass, nativeExtractMass, carrierMass } = request;
  const compute = (): Output => {
    H.domain(startingDryMass >= 0 && carrierMass >= 0);
    H.positive(nativeExtractMass);
    return {
      nativeDer: startingDryMass / nativeExtractMass,
      finishedExtractMass: nativeExtractMass + carrierMass,
      finishedDer: startingDryMass / (nativeExtractMass + carrierMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startingDryMass: 100, nativeExtractMass: 20, carrierMass: 5 },
  output: { nativeDer: 5, finishedExtractMass: 25, finishedDer: 4 },
} satisfies ToolExample<Input, Output>;
export const botanicalExtractDrugExtractRatioFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/botanical-extract-drug-extract-ratio-factor",
      title: "Botanical Extract Drug Extract Ratio Factor Tool",
      description:
        "Distinguish supplied native and carrier-containing extract mass ratios.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startingDryMass: { type: "number", minimum: 0 },
          nativeExtractMass: { type: "number", exclusiveMinimum: 0 },
          carrierMass: { type: "number", minimum: 0 },
        },
        required: ["startingDryMass", "nativeExtractMass", "carrierMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nativeDer: { type: "number" },
          finishedExtractMass: { type: "number" },
          finishedDer: { type: "number" },
        },
        required: ["nativeDer", "finishedExtractMass", "finishedDer"],
      },
      ports: {
        inputs: [
          {
            id: "startingDryMass",
            label: "Starting Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nativeExtractMass",
            label: "Native Extract Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "carrierMass",
            label: "Carrier Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nativeDer",
            label: "Native Der",
            valueType: { type: "number" },
          },
          {
            id: "finishedExtractMass",
            label: "Finished Extract Mass",
            valueType: { type: "number" },
          },
          {
            id: "finishedDer",
            label: "Finished Der",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = botanicalExtractDrugExtractRatioFactorTool.execute;
export default botanicalExtractDrugExtractRatioFactorTool;

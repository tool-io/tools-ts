import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedControl: number;
  readonly suppliedTarget: number;
  readonly suppliedStandardDeviation: number;
};
export type Output = {
  readonly signedDeviation: number;
  readonly standardizedDeviation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedControl: { type: "number" },
    suppliedTarget: { type: "number" },
    suppliedStandardDeviation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedControl", "suppliedTarget", "suppliedStandardDeviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDeviation: { type: "number" },
    standardizedDeviation: { type: "number" },
  },
  required: ["signedDeviation", "standardizedDeviation"],
} as const;
/** Standardize an explicit hematology control-minus-target deviation by supplied positive SD without applying control rules or accepting a run. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedControl, suppliedTarget, suppliedStandardDeviation } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedStandardDeviation) &&
        suppliedStandardDeviation > 0,
      "suppliedStandardDeviation",
    ),
      suppliedStandardDeviation);
    return {
      signedDeviation: observedControl - suppliedTarget,
      standardizedDeviation:
        (observedControl - suppliedTarget) / suppliedStandardDeviation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedControl: 105,
    suppliedTarget: 100,
    suppliedStandardDeviation: 5,
  },
  output: { signedDeviation: 5, standardizedDeviation: 1 },
} satisfies ToolExample<Input, Output>;
export const hematologyQualityControlTargetDeviationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/hematology-quality-control-target-deviation",
      title: "Hematology Quality Control Target Deviation Tool",
      description:
        "Standardize an explicit hematology control-minus-target deviation by supplied positive SD without applying control rules or accepting a run.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedControl: { type: "number" },
          suppliedTarget: { type: "number" },
          suppliedStandardDeviation: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "observedControl",
          "suppliedTarget",
          "suppliedStandardDeviation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedDeviation: { type: "number" },
          standardizedDeviation: { type: "number" },
        },
        required: ["signedDeviation", "standardizedDeviation"],
      },
      ports: {
        inputs: [
          {
            id: "observedControl",
            label: "Observed Control",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedTarget",
            label: "Supplied Target",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedStandardDeviation",
            label: "Supplied Standard Deviation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedDeviation",
            label: "Signed Deviation",
            valueType: { type: "number" },
          },
          {
            id: "standardizedDeviation",
            label: "Standardized Deviation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hematologyQualityControlTargetDeviationTool.execute;
export default hematologyQualityControlTargetDeviationTool;

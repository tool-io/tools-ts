import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attempts: number;
  readonly failedAcquisitions: number;
  readonly excludedAttempts: number;
  readonly excludeFromBase: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly rate: number;
  readonly usableAcquisitions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attempts: { type: "integer", minimum: 1 },
    failedAcquisitions: { type: "integer", minimum: 0 },
    excludedAttempts: { type: "integer", minimum: 0 },
    excludeFromBase: { type: "boolean" },
  },
  required: [
    "attempts",
    "failedAcquisitions",
    "excludedAttempts",
    "excludeFromBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    rate: { type: "number" },
    usableAcquisitions: { type: "integer" },
  },
  required: ["denominator", "rate", "usableAcquisitions"],
} as const;
/** Calculate biometric failure acquisition share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attempts, failedAcquisitions, excludedAttempts, excludeFromBase } =
    request;
  const compute = (): Output => {
    H.integer(attempts, 1);
    H.integer(excludedAttempts, 0, attempts - 1);
    H.integer(failedAcquisitions, 0, attempts - excludedAttempts);
    return {
      denominator: attempts - (excludeFromBase ? excludedAttempts : 0),
      rate:
        failedAcquisitions /
        (attempts - (excludeFromBase ? excludedAttempts : 0)),
      usableAcquisitions: attempts - excludedAttempts - failedAcquisitions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    attempts: 100,
    failedAcquisitions: 5,
    excludedAttempts: 10,
    excludeFromBase: true,
  },
  output: {
    denominator: 90,
    rate: 0.05555555555555555,
    usableAcquisitions: 85,
  },
} satisfies ToolExample<Input, Output>;
export const biometricFailureAcquisitionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-failure-acquisition-share",
    title: "Biometric Failure Acquisition Share Tool",
    description:
      "Calculate biometric failure acquisition share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attempts: { type: "integer", minimum: 1 },
        failedAcquisitions: { type: "integer", minimum: 0 },
        excludedAttempts: { type: "integer", minimum: 0 },
        excludeFromBase: { type: "boolean" },
      },
      required: [
        "attempts",
        "failedAcquisitions",
        "excludedAttempts",
        "excludeFromBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        rate: { type: "number" },
        usableAcquisitions: { type: "integer" },
      },
      required: ["denominator", "rate", "usableAcquisitions"],
    },
    ports: {
      inputs: [
        {
          id: "attempts",
          label: "Attempts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "failedAcquisitions",
          label: "Failed Acquisitions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedAttempts",
          label: "Excluded Attempts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeFromBase",
          label: "Exclude From Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "usableAcquisitions",
          label: "Usable Acquisitions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = biometricFailureAcquisitionShareTool.execute;
export default biometricFailureAcquisitionShareTool;

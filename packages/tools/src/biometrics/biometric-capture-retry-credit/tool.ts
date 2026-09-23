import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attempts: number;
  readonly retries: number;
  readonly excludeRetries: boolean;
  readonly successful: number;
};
export type Output = {
  readonly denominator: number;
  readonly successShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attempts: { type: "integer", minimum: 0 },
    retries: { type: "integer", minimum: 0 },
    excludeRetries: { type: "boolean" },
    successful: { type: "integer", minimum: 0 },
  },
  required: ["attempts", "retries", "excludeRetries", "successful"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    successShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "successShare", "defined"],
} as const;
/** Audit supplied successful original-capture counts and explicit retry denominator treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attempts, retries, excludeRetries, successful } = request;
  const compute = (): Output => {
    H.integer(attempts, 0);
    H.integer(retries, 0, attempts);
    H.integer(successful, 0, attempts - retries);
    return {
      denominator: attempts - (excludeRetries ? retries : 0),
      successShare:
        attempts - (excludeRetries ? retries : 0) > 0
          ? successful / (attempts - (excludeRetries ? retries : 0))
          : 0,
      defined: attempts - (excludeRetries ? retries : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attempts: 20, retries: 5, excludeRetries: true, successful: 10 },
  output: { denominator: 15, successShare: 0.6666666666666666, defined: true },
} satisfies ToolExample<Input, Output>;
export const biometricCaptureRetryCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-capture-retry-credit",
    title: "Biometric Capture Retry Credit Tool",
    description:
      "Audit supplied successful original-capture counts and explicit retry denominator treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attempts: { type: "integer", minimum: 0 },
        retries: { type: "integer", minimum: 0 },
        excludeRetries: { type: "boolean" },
        successful: { type: "integer", minimum: 0 },
      },
      required: ["attempts", "retries", "excludeRetries", "successful"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        successShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "successShare", "defined"],
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
          id: "retries",
          label: "Retries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeRetries",
          label: "Exclude Retries",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "successful",
          label: "Successful",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "successShare",
          label: "Success Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = biometricCaptureRetryCreditTool.execute;
export default biometricCaptureRetryCreditTool;

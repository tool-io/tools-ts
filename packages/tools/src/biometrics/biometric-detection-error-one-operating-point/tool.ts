import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly falseAccepts: number;
  readonly impostorAttempts: number;
  readonly falseRejects: number;
  readonly genuineAttempts: number;
  readonly priorImpostor: number;
  readonly falseAcceptCost: number;
  readonly falseRejectCost: number;
};
export type Output = {
  readonly far: number;
  readonly frr: number;
  readonly weightedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    falseAccepts: { type: "integer", minimum: 0 },
    impostorAttempts: { type: "integer", minimum: 1 },
    falseRejects: { type: "integer", minimum: 0 },
    genuineAttempts: { type: "integer", minimum: 1 },
    priorImpostor: { type: "number", minimum: 0, maximum: 1 },
    falseAcceptCost: { type: "number", minimum: 0 },
    falseRejectCost: { type: "number", minimum: 0 },
  },
  required: [
    "falseAccepts",
    "impostorAttempts",
    "falseRejects",
    "genuineAttempts",
    "priorImpostor",
    "falseAcceptCost",
    "falseRejectCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    far: { type: "number" },
    frr: { type: "number" },
    weightedCost: { type: "number" },
  },
  required: ["far", "frr", "weightedCost"],
} as const;
/** Calculate biometric detection error one operating point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    falseAccepts,
    impostorAttempts,
    falseRejects,
    genuineAttempts,
    priorImpostor,
    falseAcceptCost,
    falseRejectCost,
  } = request;
  const compute = (): Output => {
    H.integer(impostorAttempts, 1);
    H.integer(genuineAttempts, 1);
    H.integer(falseAccepts, 0, impostorAttempts);
    H.integer(falseRejects, 0, genuineAttempts);
    H.probability(priorImpostor);
    H.domain(falseAcceptCost >= 0 && falseRejectCost >= 0);
    return {
      far: falseAccepts / impostorAttempts,
      frr: falseRejects / genuineAttempts,
      weightedCost:
        (priorImpostor * falseAcceptCost * falseAccepts) / impostorAttempts +
        ((1 - priorImpostor) * falseRejectCost * falseRejects) /
          genuineAttempts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    falseAccepts: 2,
    impostorAttempts: 1000,
    falseRejects: 5,
    genuineAttempts: 100,
    priorImpostor: 0.1,
    falseAcceptCost: 10,
    falseRejectCost: 1,
  },
  output: { far: 0.002, frr: 0.05, weightedCost: 0.047 },
} satisfies ToolExample<Input, Output>;
export const biometricDetectionErrorOneOperatingPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-detection-error-one-operating-point",
      title: "Biometric Detection Error One Operating Point Tool",
      description:
        "Calculate biometric detection error one operating point from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          falseAccepts: { type: "integer", minimum: 0 },
          impostorAttempts: { type: "integer", minimum: 1 },
          falseRejects: { type: "integer", minimum: 0 },
          genuineAttempts: { type: "integer", minimum: 1 },
          priorImpostor: { type: "number", minimum: 0, maximum: 1 },
          falseAcceptCost: { type: "number", minimum: 0 },
          falseRejectCost: { type: "number", minimum: 0 },
        },
        required: [
          "falseAccepts",
          "impostorAttempts",
          "falseRejects",
          "genuineAttempts",
          "priorImpostor",
          "falseAcceptCost",
          "falseRejectCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          far: { type: "number" },
          frr: { type: "number" },
          weightedCost: { type: "number" },
        },
        required: ["far", "frr", "weightedCost"],
      },
      ports: {
        inputs: [
          {
            id: "falseAccepts",
            label: "False Accepts",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "impostorAttempts",
            label: "Impostor Attempts",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "falseRejects",
            label: "False Rejects",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "genuineAttempts",
            label: "Genuine Attempts",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "priorImpostor",
            label: "Prior Impostor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "falseAcceptCost",
            label: "False Accept Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "falseRejectCost",
            label: "False Reject Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "far", label: "Far", valueType: { type: "number" } },
          { id: "frr", label: "Frr", valueType: { type: "number" } },
          {
            id: "weightedCost",
            label: "Weighted Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricDetectionErrorOneOperatingPointTool.execute;
export default biometricDetectionErrorOneOperatingPointTool;

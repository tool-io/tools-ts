import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedMass: number;
  readonly consumedMass: number;
  readonly transferredMass: number;
  readonly recoveredMass: number;
};
export type Output = {
  readonly retainedMass: number;
  readonly netConsumed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedMass: { type: "number", minimum: 0 },
    consumedMass: { type: "number", minimum: 0 },
    transferredMass: { type: "number", minimum: 0 },
    recoveredMass: { type: "number", minimum: 0 },
  },
  required: [
    "receivedMass",
    "consumedMass",
    "transferredMass",
    "recoveredMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedMass: { type: "number" },
    netConsumed: { type: "number" },
  },
  required: ["retainedMass", "netConsumed"],
} as const;
/** Calculate evidence subsample retained mass from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedMass, consumedMass, transferredMass, recoveredMass } =
    request;
  const compute = (): Output => {
    H.domain(
      receivedMass >= 0 &&
        consumedMass >= 0 &&
        transferredMass >= 0 &&
        recoveredMass >= 0 &&
        recoveredMass <= consumedMass,
    );
    return {
      retainedMass:
        receivedMass - consumedMass - transferredMass + recoveredMass,
      netConsumed: consumedMass - recoveredMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    receivedMass: 100,
    consumedMass: 20,
    transferredMass: 10,
    recoveredMass: 5,
  },
  output: { retainedMass: 75, netConsumed: 15 },
} satisfies ToolExample<Input, Output>;
export const evidenceSubsampleRetainedMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-subsample-retained-mass",
    title: "Evidence Subsample Retained Mass Tool",
    description:
      "Calculate evidence subsample retained mass from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receivedMass: { type: "number", minimum: 0 },
        consumedMass: { type: "number", minimum: 0 },
        transferredMass: { type: "number", minimum: 0 },
        recoveredMass: { type: "number", minimum: 0 },
      },
      required: [
        "receivedMass",
        "consumedMass",
        "transferredMass",
        "recoveredMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedMass: { type: "number" },
        netConsumed: { type: "number" },
      },
      required: ["retainedMass", "netConsumed"],
    },
    ports: {
      inputs: [
        {
          id: "receivedMass",
          label: "Received Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumedMass",
          label: "Consumed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredMass",
          label: "Transferred Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredMass",
          label: "Recovered Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedMass",
          label: "Retained Mass",
          valueType: { type: "number" },
        },
        {
          id: "netConsumed",
          label: "Net Consumed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceSubsampleRetainedMassTool.execute;
export default evidenceSubsampleRetainedMassTool;

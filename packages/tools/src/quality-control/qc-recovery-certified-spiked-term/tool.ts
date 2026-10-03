import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unspiked: number;
  readonly spiked: number;
  readonly added: number;
  readonly certified: number;
};
export type Output = {
  readonly spikeRecovery: number;
  readonly certifiedRecovery: number;
  readonly spikeExcess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unspiked: { type: "number" },
    spiked: { type: "number" },
    added: { type: "number", exclusiveMinimum: 0 },
    certified: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["unspiked", "spiked", "added", "certified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spikeRecovery: { type: "number" },
    certifiedRecovery: { type: "number" },
    spikeExcess: { type: "number" },
  },
  required: ["spikeRecovery", "certifiedRecovery", "spikeExcess"],
} as const;
/** Calculate qc recovery certified spiked term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unspiked, spiked, added, certified } = request;
  const compute = (): Output => {
    H.positive(added);
    H.positive(certified);
    return {
      spikeRecovery: (spiked - unspiked) / added,
      certifiedRecovery: unspiked / certified,
      spikeExcess: spiked - unspiked - added,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unspiked: 10, spiked: 19, added: 10, certified: 12 },
  output: {
    spikeRecovery: 0.9,
    certifiedRecovery: 0.8333333333333334,
    spikeExcess: -1,
  },
} satisfies ToolExample<Input, Output>;
export const qcRecoveryCertifiedSpikedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-recovery-certified-spiked-term",
    title: "QC Recovery Certified Spiked Term Tool",
    description:
      "Calculate qc recovery certified spiked term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unspiked: { type: "number" },
        spiked: { type: "number" },
        added: { type: "number", exclusiveMinimum: 0 },
        certified: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["unspiked", "spiked", "added", "certified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spikeRecovery: { type: "number" },
        certifiedRecovery: { type: "number" },
        spikeExcess: { type: "number" },
      },
      required: ["spikeRecovery", "certifiedRecovery", "spikeExcess"],
    },
    ports: {
      inputs: [
        {
          id: "unspiked",
          label: "Unspiked",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spiked",
          label: "Spiked",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "added",
          label: "Added",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "certified",
          label: "Certified",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spikeRecovery",
          label: "Spike Recovery",
          valueType: { type: "number" },
        },
        {
          id: "certifiedRecovery",
          label: "Certified Recovery",
          valueType: { type: "number" },
        },
        {
          id: "spikeExcess",
          label: "Spike Excess",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcRecoveryCertifiedSpikedTermTool.execute;
export default qcRecoveryCertifiedSpikedTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly washVolume: number;
  readonly recoveredVolume: number;
};
export type Output = {
  readonly lostVolume: number;
  readonly recoveryFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    washVolume: { type: "number", minimum: 0 },
    recoveredVolume: { type: "number", minimum: 0 },
  },
  required: ["washVolume", "recoveredVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostVolume: { type: "number" },
    recoveryFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["lostVolume", "recoveryFraction", "defined"],
} as const;
/** Reconcile supplied backwash recovery volumes and identify an empty recovery denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { washVolume, recoveredVolume } = request;
  const compute = (): Output => {
    H.domain(
      washVolume >= 0 && recoveredVolume >= 0 && recoveredVolume <= washVolume,
      "washVolume",
    );
    return {
      lostVolume: washVolume - recoveredVolume,
      recoveryFraction: washVolume > 0 ? recoveredVolume / washVolume : 0,
      defined: washVolume > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { washVolume: 50, recoveredVolume: 40 },
  output: { lostVolume: 10, recoveryFraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const filterBackWashRecoveryLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/filter-back-wash-recovery-loss",
    title: "Filter Back Wash Recovery Loss",
    description:
      "Reconcile supplied backwash recovery volumes and identify an empty recovery denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        washVolume: { type: "number", minimum: 0 },
        recoveredVolume: { type: "number", minimum: 0 },
      },
      required: ["washVolume", "recoveredVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostVolume: { type: "number" },
        recoveryFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["lostVolume", "recoveryFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "washVolume",
          label: "Wash Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredVolume",
          label: "Recovered Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lostVolume",
          label: "Lost Volume",
          valueType: { type: "number" },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = filterBackWashRecoveryLossTool.execute;
export default filterBackWashRecoveryLossTool;

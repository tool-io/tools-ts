import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly collectedVolume: number;
};
export type Output = { readonly recoveredAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    collectedVolume: { type: "number", minimum: 0 },
  },
  required: ["concentration", "collectedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recoveredAmount: { type: "number" } },
  required: ["recoveredAmount"],
} as const;
/** Multiply explicit concentration by a compatible collected volume to obtain an amount without estimating clearance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, collectedVolume } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && collectedVolume >= 0, "concentration");
    return { recoveredAmount: concentration * collectedVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2.5, collectedVolume: 40 },
  output: { recoveredAmount: 100 },
} satisfies ToolExample<Input, Output>;
export const pkCollectedVolumeRecoveryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-collected-volume-recovery-term",
    title: "PK Collected Volume Recovery Term",
    description:
      "Multiply explicit concentration by a compatible collected volume to obtain an amount without estimating clearance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        collectedVolume: { type: "number", minimum: 0 },
      },
      required: ["concentration", "collectedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recoveredAmount: { type: "number" } },
      required: ["recoveredAmount"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveredAmount",
          label: "Recovered Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkCollectedVolumeRecoveryTermTool.execute;
export default pkCollectedVolumeRecoveryTermTool;

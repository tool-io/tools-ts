import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cueOnset: number; readonly targetOnset: number };
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cueOnset: { type: "number" }, targetOnset: { type: "number" } },
  required: ["cueOnset", "targetOnset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied target-minus-cue onset asynchrony, with positive values meaning the cue occurred first. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueOnset, targetOnset } = request;
  const compute = (): Output => {
    return { signedGap: targetOnset - cueOnset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueOnset: 12, targetOnset: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const attentionalCueSoaSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/attentional-cue-soa-sign",
    title: "Attentional Cue SOA Sign",
    description:
      "Calculate supplied target-minus-cue onset asynchrony, with positive values meaning the cue occurred first.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueOnset: { type: "number" },
        targetOnset: { type: "number" },
      },
      required: ["cueOnset", "targetOnset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "cueOnset",
          label: "Cue Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOnset",
          label: "Target Onset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = attentionalCueSoaSignTool.execute;
export default attentionalCueSoaSignTool;

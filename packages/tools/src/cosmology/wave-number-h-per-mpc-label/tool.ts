import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quotedWavenumber: number; readonly h: number };
export type Output = {
  readonly inverseMegaparsecs: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedWavenumber: { type: "number", minimum: 0 },
    h: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["quotedWavenumber", "h"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseMegaparsecs: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["inverseMegaparsecs", "label"],
} as const;
/** Label a supplied wavenumber in h/Mpc and apply an explicit positive h to obtain Mpc^-1. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedWavenumber, h } = request;
  const compute = (): Output => {
    H.domain(quotedWavenumber >= 0, "quotedWavenumber");
    (H.domain(h > 0, "h"), h);
    return {
      inverseMegaparsecs: quotedWavenumber * h,
      label: quotedWavenumber + " h/Mpc (h=" + h + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedWavenumber: 0.2, h: 0.7 },
  output: {
    inverseMegaparsecs: 0.13999999999999999,
    label: "0.2 h/Mpc (h=0.7)",
  },
} satisfies ToolExample<Input, Output>;
export const waveNumberHPerMpcLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/wave-number-h-per-mpc-label",
    title: "Wave Number H Per Mpc Label",
    description:
      "Label a supplied wavenumber in h/Mpc and apply an explicit positive h to obtain Mpc^-1.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedWavenumber: { type: "number", minimum: 0 },
        h: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["quotedWavenumber", "h"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverseMegaparsecs: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["inverseMegaparsecs", "label"],
    },
    ports: {
      inputs: [
        {
          id: "quotedWavenumber",
          label: "Quoted Wavenumber",
          required: true,
          valueType: { type: "number" },
        },
        { id: "h", label: "H", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "inverseMegaparsecs",
          label: "Inverse Megaparsecs",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = waveNumberHPerMpcLabelTool.execute;
export default waveNumberHPerMpcLabelTool;

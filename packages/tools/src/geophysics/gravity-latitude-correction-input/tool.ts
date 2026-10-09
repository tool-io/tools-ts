import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedGravity: number;
  readonly suppliedCorrection: number;
  readonly addCorrection: boolean;
};
export type Output = { readonly correctedGravity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGravity: { type: "number" },
    suppliedCorrection: { type: "number" },
    addCorrection: { type: "boolean" },
  },
  required: ["observedGravity", "suppliedCorrection", "addCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedGravity: { type: "number" } },
  required: ["correctedGravity"],
} as const;
/** Apply a caller-supplied latitude correction under an explicit add/subtract convention without calculating a gravity model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedGravity, suppliedCorrection, addCorrection } = request;
  const compute = (): Output => {
    return {
      correctedGravity:
        observedGravity +
        (addCorrection ? suppliedCorrection : -suppliedCorrection),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedGravity: 980000,
    suppliedCorrection: 12,
    addCorrection: true,
  },
  output: { correctedGravity: 980012 },
} satisfies ToolExample<Input, Output>;
export const gravityLatitudeCorrectionInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/gravity-latitude-correction-input",
    title: "Gravity Latitude Correction Input",
    description:
      "Apply a caller-supplied latitude correction under an explicit add/subtract convention without calculating a gravity model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGravity: { type: "number" },
        suppliedCorrection: { type: "number" },
        addCorrection: { type: "boolean" },
      },
      required: ["observedGravity", "suppliedCorrection", "addCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedGravity: { type: "number" } },
      required: ["correctedGravity"],
    },
    ports: {
      inputs: [
        {
          id: "observedGravity",
          label: "Observed Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCorrection",
          label: "Supplied Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addCorrection",
          label: "Add Correction",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "correctedGravity",
          label: "Corrected Gravity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gravityLatitudeCorrectionInputTool.execute;
export default gravityLatitudeCorrectionInputTool;

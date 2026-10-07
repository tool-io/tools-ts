import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly ear: string;
  readonly masked: boolean;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", exclusiveMinimum: 0 },
    ear: { type: "string", maxLength: 8192, enum: ["left", "right"] },
    masked: { type: "boolean" },
  },
  required: ["frequencyHz", "ear", "masked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicitly recorded audiogram frequency, ear and masking state without selecting clinical plot symbols or interpreting hearing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, ear, masked } = request;
  const compute = (): Output => {
    (H.domain(frequencyHz > 0, "frequencyHz"), frequencyHz);
    H.domain(["left", "right"].includes(ear), "ear");
    return {
      tag:
        frequencyHz + " Hz; " + ear + "; " + (masked ? "masked" : "unmasked"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 1000, ear: "left", masked: true },
  output: { tag: "1000 Hz; left; masked" },
} satisfies ToolExample<Input, Output>;
export const audiogramMaskedUnmaskedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/audiogram-masked-unmasked-tag",
    title: "Audiogram Masked Unmasked Tag",
    description:
      "Label explicitly recorded audiogram frequency, ear and masking state without selecting clinical plot symbols or interpreting hearing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", exclusiveMinimum: 0 },
        ear: { type: "string", maxLength: 8192, enum: ["left", "right"] },
        masked: { type: "boolean" },
      },
      required: ["frequencyHz", "ear", "masked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ear",
          label: "Ear",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "masked",
          label: "Masked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = audiogramMaskedUnmaskedTagTool.execute;
export default audiogramMaskedUnmaskedTagTool;

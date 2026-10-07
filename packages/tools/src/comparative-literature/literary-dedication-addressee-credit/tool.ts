import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workTitle: string;
  readonly addresseeWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workTitle: { type: "string", maxLength: 8192, minLength: 1 },
    addresseeWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workTitle", "addresseeWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve literal dedication addressee wording with a work title without resolving a real person's identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workTitle, addresseeWording } = request;
  const compute = (): Output => {
    H.domain(workTitle.length > 0 && addresseeWording.length > 0, "workTitle");
    return {
      label: workTitle + " — dedication: " + JSON.stringify(addresseeWording),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workTitle: "Work A", addresseeWording: "To my teacher" },
  output: { label: 'Work A — dedication: "To my teacher"' },
} satisfies ToolExample<Input, Output>;
export const literaryDedicationAddresseeCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/literary-dedication-addressee-credit",
    title: "Literary Dedication Addressee Credit",
    description:
      "Preserve literal dedication addressee wording with a work title without resolving a real person's identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workTitle: { type: "string", maxLength: 8192, minLength: 1 },
        addresseeWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["workTitle", "addresseeWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "workTitle",
          label: "Work Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "addresseeWording",
          label: "Addressee Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = literaryDedicationAddresseeCreditTool.execute;
export default literaryDedicationAddresseeCreditTool;

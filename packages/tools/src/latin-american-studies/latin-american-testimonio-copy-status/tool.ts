import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedCopyStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCopyStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["original", "certified-copy", "transcript", "unspecified"],
    },
  },
  required: ["recordId", "suppliedCopyStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded testimonio copy status without authenticating a document or its legal effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedCopyStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["original", "certified-copy", "transcript", "unspecified"].includes(
        suppliedCopyStatus,
      ),
      "suppliedCopyStatus",
    );
    return { label: recordId + " [" + suppliedCopyStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", suppliedCopyStatus: "certified-copy" },
  output: { label: "R17 [certified-copy]" },
} satisfies ToolExample<Input, Output>;
export const latinAmericanTestimonioCopyStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "latin-american-studies",
        "latin american studies",
        "humanities",
      ],
      keywords: ["latin american studies", "humanities"],
    },
    id: "latin-american-studies/latin-american-testimonio-copy-status",
    title: "Latin American Testimonio Copy Status",
    description:
      "Label an explicitly recorded testimonio copy status without authenticating a document or its legal effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCopyStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["original", "certified-copy", "transcript", "unspecified"],
        },
      },
      required: ["recordId", "suppliedCopyStatus"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCopyStatus",
          label: "Supplied Copy Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = latinAmericanTestimonioCopyStatusTool.execute;
export default latinAmericanTestimonioCopyStatusTool;

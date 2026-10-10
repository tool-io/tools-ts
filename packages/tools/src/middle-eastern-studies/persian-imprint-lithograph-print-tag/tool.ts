import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly reportedMethod: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedMethod: {
      type: "string",
      maxLength: 8192,
      enum: ["lithograph", "typographic", "mixed", "unknown"],
    },
  },
  required: ["publicationId", "reportedMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported Persian imprint production method without identifying materials or authenticating an edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, reportedMethod } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(
      ["lithograph", "typographic", "mixed", "unknown"].includes(
        reportedMethod,
      ),
      "reportedMethod",
    );
    return { label: publicationId + " [" + reportedMethod + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { publicationId: "PUB17", reportedMethod: "lithograph" },
  output: { label: "PUB17 [lithograph]" },
} satisfies ToolExample<Input, Output>;
export const persianImprintLithographPrintTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/persian-imprint-lithograph-print-tag",
    title: "Persian Imprint Lithograph Print Tag",
    description:
      "Label an explicitly reported Persian imprint production method without identifying materials or authenticating an edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedMethod: {
          type: "string",
          maxLength: 8192,
          enum: ["lithograph", "typographic", "mixed", "unknown"],
        },
      },
      required: ["publicationId", "reportedMethod"],
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
          id: "publicationId",
          label: "Publication Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedMethod",
          label: "Reported Method",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = persianImprintLithographPrintTagTool.execute;
export default persianImprintLithographPrintTagTool;

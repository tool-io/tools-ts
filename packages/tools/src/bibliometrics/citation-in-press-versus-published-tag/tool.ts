import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceId: string;
  readonly publicationStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    publicationStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["in-press", "published", "preprint", "unknown"],
    },
  },
  required: ["referenceId", "publicationStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit publication-status label to a citation identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceId, publicationStatus } = request;
  const compute = (): Output => {
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(
      ["in-press", "published", "preprint", "unknown"].includes(
        publicationStatus,
      ),
      "publicationStatus",
    );
    return { label: referenceId + " [" + publicationStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceId: "R17", publicationStatus: "in-press" },
  output: { label: "R17 [in-press]" },
} satisfies ToolExample<Input, Output>;
export const citationInPressVersusPublishedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/citation-in-press-versus-published-tag",
    title: "Citation In Press Versus Published Tag",
    description:
      "Attach an explicit publication-status label to a citation identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceId: { type: "string", maxLength: 8192, minLength: 1 },
        publicationStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["in-press", "published", "preprint", "unknown"],
        },
      },
      required: ["referenceId", "publicationStatus"],
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
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicationStatus",
          label: "Publication Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = citationInPressVersusPublishedTagTool.execute;
export default citationInPressVersusPublishedTagTool;

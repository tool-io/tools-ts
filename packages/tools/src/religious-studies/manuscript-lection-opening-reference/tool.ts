import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly lectionId: string;
  readonly suppliedOpeningReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    lectionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOpeningReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "lectionId", "suppliedOpeningReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit manuscript lection-opening locator without identifying or interpreting the text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, lectionId, suppliedOpeningReference } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(lectionId.length > 0, "lectionId");
    H.domain(suppliedOpeningReference.length > 0, "suppliedOpeningReference");
    return {
      token: JSON.stringify([
        manuscriptId,
        lectionId,
        suppliedOpeningReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manuscriptId: "MS17",
    lectionId: "L2",
    suppliedOpeningReference: "folio 3r",
  },
  output: { token: '["MS17","L2","folio 3r"]' },
} satisfies ToolExample<Input, Output>;
export const manuscriptLectionOpeningReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/manuscript-lection-opening-reference",
    title: "Manuscript Lection Opening Reference",
    description:
      "Qualify an explicit manuscript lection-opening locator without identifying or interpreting the text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
        lectionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedOpeningReference: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["manuscriptId", "lectionId", "suppliedOpeningReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "manuscriptId",
          label: "Manuscript Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lectionId",
          label: "Lection Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOpeningReference",
          label: "Supplied Opening Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = manuscriptLectionOpeningReferenceTool.execute;
export default manuscriptLectionOpeningReferenceTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly suppliedRubricText: string;
  readonly sourceLocator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRubricText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "suppliedRubricText", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly transcribed manuscript rubric by locator without recognizing or interpreting script. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, suppliedRubricText, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(suppliedRubricText.length > 0, "suppliedRubricText");
    H.domain(sourceLocator.length > 0, "sourceLocator");
    return {
      token: JSON.stringify([manuscriptId, suppliedRubricText, sourceLocator]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manuscriptId: "MS17",
    suppliedRubricText: "Rubric A",
    sourceLocator: "folio 3r",
  },
  output: { token: '["MS17","Rubric A","folio 3r"]' },
} satisfies ToolExample<Input, Output>;
export const arabicManuscriptRubricationMarkerTool = H.defineSchemaCalculation<
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
    id: "middle-eastern-studies/arabic-manuscript-rubrication-marker",
    title: "Arabic Manuscript Rubrication Marker",
    description:
      "Qualify an explicitly transcribed manuscript rubric by locator without recognizing or interpreting script.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRubricText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["manuscriptId", "suppliedRubricText", "sourceLocator"],
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
          id: "suppliedRubricText",
          label: "Supplied Rubric Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLocator",
          label: "Source Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arabicManuscriptRubricationMarkerTool.execute;
export default arabicManuscriptRubricationMarkerTool;

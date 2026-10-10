import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly relation: string;
  readonly sessionId: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    relation: {
      type: "string",
      maxLength: 8192,
      enum: ["pre", "during", "post", "unspecified"],
    },
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "relation", "sessionId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly recorded sample-to-session timing relation without inferring sampling protocol compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, relation, sessionId } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && sessionId.length > 0, "specimenId");
    H.domain(
      ["pre", "during", "post", "unspecified"].includes(relation),
      "relation",
    );
    return { tag: JSON.stringify([specimenId, relation, sessionId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", relation: "pre", sessionId: "SES3" },
  output: { tag: '["S17","pre","SES3"]' },
} satisfies ToolExample<Input, Output>;
export const renalSamplePrePostSessionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/renal-sample-pre-post-session-tag",
    title: "Renal Sample Pre Post Session Tag",
    description:
      "Label an explicitly recorded sample-to-session timing relation without inferring sampling protocol compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        relation: {
          type: "string",
          maxLength: 8192,
          enum: ["pre", "during", "post", "unspecified"],
        },
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "relation", "sessionId"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relation",
          label: "Relation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sessionId",
          label: "Session Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = renalSamplePrePostSessionTagTool.execute;
export default renalSamplePrePostSessionTagTool;

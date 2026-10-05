import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scribeName: string;
  readonly role: string;
  readonly folioReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scribeName: { type: "string", maxLength: 8192 },
    role: {
      type: "string",
      maxLength: 8192,
      enum: ["scribe", "copyist", "corrector", "illuminator", "uncertain"],
    },
    folioReference: { type: "string", maxLength: 8192 },
  },
  required: ["scribeName", "role", "folioReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded manuscript colophon person-role association without judging attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scribeName, role, folioReference } = request;
  const compute = (): Output => {
    H.domain(scribeName.length > 0 && folioReference.length > 0, "scribeName");
    H.domain(
      ["scribe", "copyist", "corrector", "illuminator", "uncertain"].includes(
        role,
      ),
      "role",
    );
    return { label: scribeName + " [" + role + "; " + folioReference + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scribeName: "Name A", role: "scribe", folioReference: "12v" },
  output: { label: "Name A [scribe; 12v]" },
} satisfies ToolExample<Input, Output>;
export const manuscriptColophonScribeRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/manuscript-colophon-scribe-role",
    title: "Manuscript Colophon Scribe Role Tool",
    description:
      "Label an explicitly recorded manuscript colophon person-role association without judging attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scribeName: { type: "string", maxLength: 8192 },
        role: {
          type: "string",
          maxLength: 8192,
          enum: ["scribe", "copyist", "corrector", "illuminator", "uncertain"],
        },
        folioReference: { type: "string", maxLength: 8192 },
      },
      required: ["scribeName", "role", "folioReference"],
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
          id: "scribeName",
          label: "Scribe Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "folioReference",
          label: "Folio Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = manuscriptColophonScribeRoleTool.execute;
export default manuscriptColophonScribeRoleTool;

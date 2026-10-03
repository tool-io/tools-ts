import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly action: string;
  readonly documentId: string;
  readonly parentId: string;
  readonly knownIds: readonly string[];
};
export type Output = {
  readonly parentKnown: boolean;
  readonly selfParent: boolean;
  readonly actionConsistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    action: {
      type: "string",
      maxLength: 8192,
      enum: ["new", "replace", "delete", "append"],
    },
    documentId: { type: "string", maxLength: 8192 },
    parentId: { type: "string", maxLength: 8192 },
    knownIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["action", "documentId", "parentId", "knownIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentKnown: { type: "boolean" },
    selfParent: { type: "boolean" },
    actionConsistent: { type: "boolean" },
  },
  required: ["parentKnown", "selfParent", "actionConsistent"],
} as const;
/** Audit explicit document lifecycle links without submission validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { action, documentId, parentId, knownIds } = request;
  const compute = (): Output => {
    H.domain(["new", "replace", "delete", "append"].includes(action), "action");
    const parentKnown = knownIds.includes(parentId),
      selfParent = documentId === parentId;
    return {
      parentKnown,
      selfParent,
      actionConsistent:
        action === "new" ? parentId.length === 0 : parentKnown && !selfParent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    action: "replace",
    documentId: "D2",
    parentId: "D1",
    knownIds: ["D1"],
  },
  output: { parentKnown: true, selfParent: false, actionConsistent: true },
} satisfies ToolExample<Input, Output>;
export const regulatoryDocumentLifecycleParentTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-document-lifecycle-parent-token",
      title: "Regulatory Document Lifecycle Parent Token Tool",
      description:
        "Audit explicit document lifecycle links without submission validation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: {
            type: "string",
            maxLength: 8192,
            enum: ["new", "replace", "delete", "append"],
          },
          documentId: { type: "string", maxLength: 8192 },
          parentId: { type: "string", maxLength: 8192 },
          knownIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["action", "documentId", "parentId", "knownIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentKnown: { type: "boolean" },
          selfParent: { type: "boolean" },
          actionConsistent: { type: "boolean" },
        },
        required: ["parentKnown", "selfParent", "actionConsistent"],
      },
      ports: {
        inputs: [
          {
            id: "action",
            label: "Action",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "documentId",
            label: "Document Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "parentId",
            label: "Parent Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "knownIds",
            label: "Known Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "parentKnown",
            label: "Parent Known",
            valueType: { type: "boolean" },
          },
          {
            id: "selfParent",
            label: "Self Parent",
            valueType: { type: "boolean" },
          },
          {
            id: "actionConsistent",
            label: "Action Consistent",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryDocumentLifecycleParentTokenTool.execute;
export default regulatoryDocumentLifecycleParentTokenTool;

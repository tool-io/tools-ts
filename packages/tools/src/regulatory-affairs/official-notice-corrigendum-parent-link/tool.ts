import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeId: string;
  readonly targetId: string;
  readonly originalId: string;
  readonly correctedFields: readonly string[];
  readonly knownFields: readonly string[];
};
export type Output = {
  readonly parentMatches: boolean;
  readonly selfLink: boolean;
  readonly unknownFields: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeId: { type: "string", maxLength: 8192 },
    targetId: { type: "string", maxLength: 8192 },
    originalId: { type: "string", maxLength: 8192 },
    correctedFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    knownFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "noticeId",
    "targetId",
    "originalId",
    "correctedFields",
    "knownFields",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    selfLink: { type: "boolean" },
    unknownFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["parentMatches", "selfLink", "unknownFields"],
} as const;
/** Check explicit correction notice links and field vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeId, targetId, originalId, correctedFields, knownFields } =
    request;
  const compute = (): Output => {
    return {
      parentMatches: targetId === originalId,
      selfLink: noticeId === targetId,
      unknownFields: [
        ...new Set(correctedFields.filter((x) => !knownFields.includes(x))),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noticeId: "N1",
    targetId: "R1",
    originalId: "R1",
    correctedFields: ["title", "date"],
    knownFields: ["title"],
  },
  output: { parentMatches: true, selfLink: false, unknownFields: ["date"] },
} satisfies ToolExample<Input, Output>;
export const officialNoticeCorrigendumParentLinkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/official-notice-corrigendum-parent-link",
      title: "Official Notice Corrigendum Parent Link Tool",
      description:
        "Check explicit correction notice links and field vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeId: { type: "string", maxLength: 8192 },
          targetId: { type: "string", maxLength: 8192 },
          originalId: { type: "string", maxLength: 8192 },
          correctedFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          knownFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: [
          "noticeId",
          "targetId",
          "originalId",
          "correctedFields",
          "knownFields",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMatches: { type: "boolean" },
          selfLink: { type: "boolean" },
          unknownFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["parentMatches", "selfLink", "unknownFields"],
      },
      ports: {
        inputs: [
          {
            id: "noticeId",
            label: "Notice Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetId",
            label: "Target Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalId",
            label: "Original Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "correctedFields",
            label: "Corrected Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "knownFields",
            label: "Known Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "parentMatches",
            label: "Parent Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "selfLink",
            label: "Self Link",
            valueType: { type: "boolean" },
          },
          {
            id: "unknownFields",
            label: "Unknown Fields",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = officialNoticeCorrigendumParentLinkTool.execute;
export default officialNoticeCorrigendumParentLinkTool;

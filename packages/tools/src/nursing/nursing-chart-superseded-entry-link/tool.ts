import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly replacementId: string;
  readonly replacementParent: string;
  readonly originalActive: boolean;
  readonly replacementActive: boolean;
};
export type Output = {
  readonly linked: boolean;
  readonly simultaneousActive: boolean;
  readonly selfReference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192 },
    replacementId: { type: "string", maxLength: 8192 },
    replacementParent: { type: "string", maxLength: 8192 },
    originalActive: { type: "boolean" },
    replacementActive: { type: "boolean" },
  },
  required: [
    "entryId",
    "replacementId",
    "replacementParent",
    "originalActive",
    "replacementActive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    simultaneousActive: { type: "boolean" },
    selfReference: { type: "boolean" },
  },
  required: ["linked", "simultaneousActive", "selfReference"],
} as const;
/** Audit supplied chart replacement links and conflicting active flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    entryId,
    replacementId,
    replacementParent,
    originalActive,
    replacementActive,
  } = request;
  const compute = (): Output => {
    H.domain(
      [entryId, replacementId, replacementParent].every((x) => x.length > 0),
    );
    return {
      linked: replacementParent === entryId && entryId !== replacementId,
      simultaneousActive: originalActive && replacementActive,
      selfReference: replacementId === replacementParent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryId: "E1",
    replacementId: "E2",
    replacementParent: "E1",
    originalActive: false,
    replacementActive: true,
  },
  output: { linked: true, simultaneousActive: false, selfReference: false },
} satisfies ToolExample<Input, Output>;
export const nursingChartSupersededEntryLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-chart-superseded-entry-link",
    title: "Nursing Chart Superseded Entry Link Tool",
    description:
      "Audit supplied chart replacement links and conflicting active flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192 },
        replacementId: { type: "string", maxLength: 8192 },
        replacementParent: { type: "string", maxLength: 8192 },
        originalActive: { type: "boolean" },
        replacementActive: { type: "boolean" },
      },
      required: [
        "entryId",
        "replacementId",
        "replacementParent",
        "originalActive",
        "replacementActive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        simultaneousActive: { type: "boolean" },
        selfReference: { type: "boolean" },
      },
      required: ["linked", "simultaneousActive", "selfReference"],
    },
    ports: {
      inputs: [
        {
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replacementId",
          label: "Replacement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replacementParent",
          label: "Replacement Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalActive",
          label: "Original Active",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "replacementActive",
          label: "Replacement Active",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "simultaneousActive",
          label: "Simultaneous Active",
          valueType: { type: "boolean" },
        },
        {
          id: "selfReference",
          label: "Self Reference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingChartSupersededEntryLinkTool.execute;
export default nursingChartSupersededEntryLinkTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly lotId: string;
  readonly knownLotIds: readonly string[];
  readonly priorSampleIds: readonly string[];
  readonly priorLotIds: readonly string[];
};
export type Output = {
  readonly lotKnown: boolean;
  readonly conflictingParent: boolean;
  readonly linkKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192 },
    lotId: { type: "string", maxLength: 8192 },
    knownLotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    priorSampleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    priorLotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "sampleId",
    "lotId",
    "knownLotIds",
    "priorSampleIds",
    "priorLotIds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotKnown: { type: "boolean" },
    conflictingParent: { type: "boolean" },
    linkKey: { type: "string", maxLength: 8192 },
  },
  required: ["lotKnown", "conflictingParent", "linkKey"],
} as const;
/** Audit exact supplied sample-to-lot links without authenticating chain of custody. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, lotId, knownLotIds, priorSampleIds, priorLotIds } = request;
  const compute = (): Output => {
    H.sameLength(priorSampleIds, priorLotIds);
    return {
      lotKnown: knownLotIds.includes(lotId),
      conflictingParent: priorSampleIds.some(
        (x, i) => x === sampleId && priorLotIds[i] !== lotId,
      ),
      linkKey: JSON.stringify([lotId, sampleId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S1",
    lotId: "L2",
    knownLotIds: ["L1", "L2"],
    priorSampleIds: ["S1"],
    priorLotIds: ["L1"],
  },
  output: { lotKnown: true, conflictingParent: true, linkKey: '["L2","S1"]' },
} satisfies ToolExample<Input, Output>;
export const glpSampleLotParentTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-sample-lot-parent-token",
    title: "GLP Sample Lot Parent Token Tool",
    description:
      "Audit exact supplied sample-to-lot links without authenticating chain of custody.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192 },
        lotId: { type: "string", maxLength: 8192 },
        knownLotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        priorSampleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        priorLotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "sampleId",
        "lotId",
        "knownLotIds",
        "priorSampleIds",
        "priorLotIds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotKnown: { type: "boolean" },
        conflictingParent: { type: "boolean" },
        linkKey: { type: "string", maxLength: 8192 },
      },
      required: ["lotKnown", "conflictingParent", "linkKey"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "knownLotIds",
          label: "Known Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "priorSampleIds",
          label: "Prior Sample Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "priorLotIds",
          label: "Prior Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "lotKnown", label: "Lot Known", valueType: { type: "boolean" } },
        {
          id: "conflictingParent",
          label: "Conflicting Parent",
          valueType: { type: "boolean" },
        },
        { id: "linkKey", label: "Link Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = glpSampleLotParentTokenTool.execute;
export default glpSampleLotParentTokenTool;

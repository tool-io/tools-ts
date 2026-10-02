import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly labParentId: string;
  readonly requestedRevision: number;
  readonly labRevision: number;
  readonly superseded: boolean;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly sameRevision: boolean;
  readonly stale: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192 },
    labParentId: { type: "string", maxLength: 8192 },
    requestedRevision: { type: "integer", minimum: 0 },
    labRevision: { type: "integer", minimum: 0 },
    superseded: { type: "boolean" },
  },
  required: [
    "requestId",
    "labParentId",
    "requestedRevision",
    "labRevision",
    "superseded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    sameRevision: { type: "boolean" },
    stale: { type: "boolean" },
  },
  required: ["parentMatches", "sameRevision", "stale"],
} as const;
/** Audit explicit laboratory revision/parent metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, labParentId, requestedRevision, labRevision, superseded } =
    request;
  const compute = (): Output => {
    H.integer(requestedRevision, 0);
    H.integer(labRevision, 0);
    return {
      parentMatches: requestId === labParentId,
      sameRevision: requestedRevision === labRevision,
      stale: superseded || labRevision < requestedRevision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestId: "R1",
    labParentId: "R1",
    requestedRevision: 3,
    labRevision: 2,
    superseded: false,
  },
  output: { parentMatches: true, sameRevision: false, stale: true },
} satisfies ToolExample<Input, Output>;
export const prosthodonticRecordLabRevisionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthodontic-record-lab-revision-pair",
    title: "Prosthodontic Record Lab Revision Pair Tool",
    description: "Audit explicit laboratory revision/parent metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestId: { type: "string", maxLength: 8192 },
        labParentId: { type: "string", maxLength: 8192 },
        requestedRevision: { type: "integer", minimum: 0 },
        labRevision: { type: "integer", minimum: 0 },
        superseded: { type: "boolean" },
      },
      required: [
        "requestId",
        "labParentId",
        "requestedRevision",
        "labRevision",
        "superseded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMatches: { type: "boolean" },
        sameRevision: { type: "boolean" },
        stale: { type: "boolean" },
      },
      required: ["parentMatches", "sameRevision", "stale"],
    },
    ports: {
      inputs: [
        {
          id: "requestId",
          label: "Request Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labParentId",
          label: "Lab Parent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedRevision",
          label: "Requested Revision",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "labRevision",
          label: "Lab Revision",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "superseded",
          label: "Superseded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "parentMatches",
          label: "Parent Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "sameRevision",
          label: "Same Revision",
          valueType: { type: "boolean" },
        },
        { id: "stale", label: "Stale", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = prosthodonticRecordLabRevisionPairTool.execute;
export default prosthodonticRecordLabRevisionPairTool;

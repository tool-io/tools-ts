import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commitmentIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly evidenceVerified: readonly boolean[];
  readonly commitmentClosed: readonly boolean[];
};
export type Output = {
  readonly closedCommitments: number;
  readonly supportedClosed: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commitmentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    evidenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    evidenceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    commitmentClosed: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "commitmentIds",
    "evidenceIds",
    "evidenceVerified",
    "commitmentClosed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closedCommitments: { type: "integer" },
    supportedClosed: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["closedCommitments", "supportedClosed", "share", "defined"],
} as const;
/** Calculate commitment evidence support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commitmentIds, evidenceIds, evidenceVerified, commitmentClosed } =
    request;
  const compute = (): Output => {
    H.sameLength(commitmentIds, evidenceIds);
    H.sameLength(commitmentIds, evidenceVerified);
    H.sameLength(commitmentIds, commitmentClosed);
    return (() => {
      const a = new Set(commitmentIds.filter((x, i) => commitmentClosed[i])),
        b = new Set(
          commitmentIds.filter(
            (x, i) =>
              commitmentClosed[i] &&
              evidenceIds[i].length > 0 &&
              evidenceVerified[i],
          ),
        );
      return {
        closedCommitments: a.size,
        supportedClosed: b.size,
        share: a.size ? b.size / a.size : 0,
        defined: a.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    commitmentIds: ["a", "a", "b"],
    evidenceIds: ["e1", "", ""],
    evidenceVerified: [true, false, false],
    commitmentClosed: [true, true, true],
  },
  output: {
    closedCommitments: 2,
    supportedClosed: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const commitmentEvidenceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/commitment-evidence-support-share",
    title: "Commitment Evidence Support Share Tool",
    description:
      "Calculate commitment evidence support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commitmentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        evidenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        evidenceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        commitmentClosed: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "commitmentIds",
        "evidenceIds",
        "evidenceVerified",
        "commitmentClosed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closedCommitments: { type: "integer" },
        supportedClosed: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["closedCommitments", "supportedClosed", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "commitmentIds",
          label: "Commitment Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "evidenceIds",
          label: "Evidence Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "evidenceVerified",
          label: "Evidence Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "commitmentClosed",
          label: "Commitment Closed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "closedCommitments",
          label: "Closed Commitments",
          valueType: { type: "integer" },
        },
        {
          id: "supportedClosed",
          label: "Supported Closed",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = commitmentEvidenceSupportShareTool.execute;
export default commitmentEvidenceSupportShareTool;

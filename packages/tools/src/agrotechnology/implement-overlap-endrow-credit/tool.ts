import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly overlapArea: number;
  readonly endrowArea: number;
  readonly sharedExclusion: number;
  readonly creditEndrows: boolean;
};
export type Output = {
  readonly netArea: number;
  readonly excludedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    overlapArea: { type: "number", minimum: 0 },
    endrowArea: { type: "number", minimum: 0 },
    sharedExclusion: { type: "number", minimum: 0 },
    creditEndrows: { type: "boolean" },
  },
  required: [
    "grossArea",
    "overlapArea",
    "endrowArea",
    "sharedExclusion",
    "creditEndrows",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netArea: { type: "number" }, excludedArea: { type: "number" } },
  required: ["netArea", "excludedArea"],
} as const;
/** Calculate implement overlap endrow credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, overlapArea, endrowArea, sharedExclusion, creditEndrows } =
    request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        overlapArea >= 0 &&
        endrowArea >= 0 &&
        sharedExclusion >= 0 &&
        sharedExclusion <= Math.min(overlapArea, endrowArea) &&
        overlapArea + endrowArea - sharedExclusion <= grossArea,
    );
    return {
      netArea:
        grossArea -
        overlapArea -
        (creditEndrows ? endrowArea - sharedExclusion : 0),
      excludedArea:
        overlapArea + (creditEndrows ? endrowArea - sharedExclusion : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossArea: 100,
    overlapArea: 10,
    endrowArea: 20,
    sharedExclusion: 5,
    creditEndrows: true,
  },
  output: { netArea: 75, excludedArea: 25 },
} satisfies ToolExample<Input, Output>;
export const implementOverlapEndrowCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/implement-overlap-endrow-credit",
    title: "Implement Overlap Endrow Credit Tool",
    description:
      "Calculate implement overlap endrow credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        overlapArea: { type: "number", minimum: 0 },
        endrowArea: { type: "number", minimum: 0 },
        sharedExclusion: { type: "number", minimum: 0 },
        creditEndrows: { type: "boolean" },
      },
      required: [
        "grossArea",
        "overlapArea",
        "endrowArea",
        "sharedExclusion",
        "creditEndrows",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netArea: { type: "number" },
        excludedArea: { type: "number" },
      },
      required: ["netArea", "excludedArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endrowArea",
          label: "Endrow Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedExclusion",
          label: "Shared Exclusion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditEndrows",
          label: "Credit Endrows",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
        {
          id: "excludedArea",
          label: "Excluded Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementOverlapEndrowCreditTool.execute;
export default implementOverlapEndrowCreditTool;

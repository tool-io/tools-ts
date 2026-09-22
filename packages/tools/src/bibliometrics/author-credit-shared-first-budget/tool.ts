import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCredit: number;
  readonly firstRoleShare: number;
  readonly sharedFirstAuthors: number;
  readonly otherAuthors: number;
};
export type Output = {
  readonly eachFirst: number;
  readonly eachOther: number;
  readonly unallocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCredit: { type: "number", minimum: 0 },
    firstRoleShare: { type: "number", minimum: 0, maximum: 1 },
    sharedFirstAuthors: { type: "integer", minimum: 1 },
    otherAuthors: { type: "integer", minimum: 0 },
  },
  required: [
    "totalCredit",
    "firstRoleShare",
    "sharedFirstAuthors",
    "otherAuthors",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eachFirst: { type: "number" },
    eachOther: { type: "number" },
    unallocated: { type: "number" },
  },
  required: ["eachFirst", "eachOther", "unallocated"],
} as const;
/** Allocate supplied bibliometric credit by an explicit shared-first policy, preserving unallocated remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCredit, firstRoleShare, sharedFirstAuthors, otherAuthors } =
    request;
  const compute = (): Output => {
    H.domain(totalCredit >= 0);
    H.probability(firstRoleShare);
    H.integer(sharedFirstAuthors, 1);
    H.integer(otherAuthors, 0);
    return {
      eachFirst: (totalCredit * firstRoleShare) / sharedFirstAuthors,
      eachOther:
        otherAuthors > 0
          ? (totalCredit * (1 - firstRoleShare)) / otherAuthors
          : 0,
      unallocated: otherAuthors > 0 ? 0 : totalCredit * (1 - firstRoleShare),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalCredit: 1,
    firstRoleShare: 0.5,
    sharedFirstAuthors: 2,
    otherAuthors: 5,
  },
  output: { eachFirst: 0.25, eachOther: 0.1, unallocated: 0 },
} satisfies ToolExample<Input, Output>;
export const authorCreditSharedFirstBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/author-credit-shared-first-budget",
    title: "Author Credit Shared First Budget Tool",
    description:
      "Allocate supplied bibliometric credit by an explicit shared-first policy, preserving unallocated remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCredit: { type: "number", minimum: 0 },
        firstRoleShare: { type: "number", minimum: 0, maximum: 1 },
        sharedFirstAuthors: { type: "integer", minimum: 1 },
        otherAuthors: { type: "integer", minimum: 0 },
      },
      required: [
        "totalCredit",
        "firstRoleShare",
        "sharedFirstAuthors",
        "otherAuthors",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eachFirst: { type: "number" },
        eachOther: { type: "number" },
        unallocated: { type: "number" },
      },
      required: ["eachFirst", "eachOther", "unallocated"],
    },
    ports: {
      inputs: [
        {
          id: "totalCredit",
          label: "Total Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRoleShare",
          label: "First Role Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "sharedFirstAuthors",
          label: "Shared First Authors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "otherAuthors",
          label: "Other Authors",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "eachFirst", label: "Each First", valueType: { type: "number" } },
        { id: "eachOther", label: "Each Other", valueType: { type: "number" } },
        {
          id: "unallocated",
          label: "Unallocated",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorCreditSharedFirstBudgetTool.execute;
export default authorCreditSharedFirstBudgetTool;

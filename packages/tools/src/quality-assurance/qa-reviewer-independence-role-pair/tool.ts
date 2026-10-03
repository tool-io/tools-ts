import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorIds: readonly string[];
  readonly reviewerIds: readonly string[];
  readonly prohibitedSharedRoles: readonly string[];
  readonly authorRoles: readonly string[];
  readonly reviewerRoles: readonly string[];
};
export type Output = {
  readonly sharedPeople: readonly string[];
  readonly sharedProhibitedRoles: readonly string[];
  readonly independentUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reviewerIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    prohibitedSharedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reviewerRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "authorIds",
    "reviewerIds",
    "prohibitedSharedRoles",
    "authorRoles",
    "reviewerRoles",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedPeople: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sharedProhibitedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    independentUnderRule: { type: "boolean" },
  },
  required: ["sharedPeople", "sharedProhibitedRoles", "independentUnderRule"],
} as const;
/** Compare supplied reviewer identities and prohibited role overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    authorIds,
    reviewerIds,
    prohibitedSharedRoles,
    authorRoles,
    reviewerRoles,
  } = request;
  const compute = (): Output => {
    const sharedPeople = [
        ...new Set(authorIds.filter((x) => reviewerIds.includes(x))),
      ],
      sharedProhibitedRoles = [
        ...new Set(
          authorRoles.filter(
            (x) =>
              reviewerRoles.includes(x) && prohibitedSharedRoles.includes(x),
          ),
        ),
      ];
    return {
      sharedPeople,
      sharedProhibitedRoles,
      independentUnderRule:
        sharedPeople.length === 0 && sharedProhibitedRoles.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    authorIds: ["A"],
    reviewerIds: ["B"],
    prohibitedSharedRoles: ["owner"],
    authorRoles: ["owner"],
    reviewerRoles: ["owner"],
  },
  output: {
    sharedPeople: [],
    sharedProhibitedRoles: ["owner"],
    independentUnderRule: false,
  },
} satisfies ToolExample<Input, Output>;
export const qaReviewerIndependenceRolePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/qa-reviewer-independence-role-pair",
    title: "QA Reviewer Independence Role Pair Tool",
    description:
      "Compare supplied reviewer identities and prohibited role overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reviewerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        prohibitedSharedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reviewerRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "authorIds",
        "reviewerIds",
        "prohibitedSharedRoles",
        "authorRoles",
        "reviewerRoles",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedPeople: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sharedProhibitedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        independentUnderRule: { type: "boolean" },
      },
      required: [
        "sharedPeople",
        "sharedProhibitedRoles",
        "independentUnderRule",
      ],
    },
    ports: {
      inputs: [
        {
          id: "authorIds",
          label: "Author Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reviewerIds",
          label: "Reviewer Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "prohibitedSharedRoles",
          label: "Prohibited Shared Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorRoles",
          label: "Author Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reviewerRoles",
          label: "Reviewer Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sharedPeople",
          label: "Shared People",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sharedProhibitedRoles",
          label: "Shared Prohibited Roles",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "independentUnderRule",
          label: "Independent Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qaReviewerIndependenceRolePairTool.execute;
export default qaReviewerIndependenceRolePairTool;

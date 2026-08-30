import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EngagementLetterInclusionInput = {
  readonly includedElements: ReadonlyArray<string>;
  readonly requiredElements: ReadonlyArray<string>;
};

export type EngagementLetterInclusionOutput = {
  readonly complete: boolean;
  readonly includedCount: number;
  readonly missingCount: number;
  readonly missingElements: ReadonlyArray<string>;
  readonly requiredCount: number;
};

const normalize = (
  values: ReadonlyArray<string>,
  field: string,
): ReadonlyArray<string> => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "element_list_required");
  return values.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `${field}.${index}`,
        `${field} entries must be nonempty strings.`,
        "invalid_element",
      );
    return value.trim().toLowerCase();
  });
};

export const checkEngagementLetterInclusions = (
  input: EngagementLetterInclusionInput,
): EngagementLetterInclusionOutput => {
  const required = normalize(input.requiredElements, "requiredElements");
  if (required.length === 0)
    simpleError(
      "requiredElements",
      "At least one required engagement-letter element is needed.",
      "required_elements_required",
    );
  const included = new Set(
    normalize(input.includedElements, "includedElements"),
  );
  const missingElements = [
    ...new Set(required.filter((element) => !included.has(element))),
  ];
  return {
    complete: missingElements.length === 0,
    includedCount: new Set(included).size,
    missingCount: missingElements.length,
    missingElements,
    requiredCount: new Set(required).size,
  };
};

export const engagementLetterInclusionExample = {
  input: {
    includedElements: [
      "Engagement partner",
      "Financial statement audit scope",
      "Management responsibilities",
      "Audit fee",
    ],
    requiredElements: [
      "Engagement partner",
      "Financial statement audit scope",
      "Management responsibilities",
      "Audit fee",
      "Engagement acceptance",
    ],
  },
  output: {
    complete: false,
    includedCount: 4,
    missingCount: 1,
    missingElements: ["engagement acceptance"],
    requiredCount: 5,
  },
} satisfies ToolExample<
  EngagementLetterInclusionInput,
  EngagementLetterInclusionOutput
>;

export const engagementLetterInclusionTool = createSimpleTool({
  calculate: (input) =>
    checkEngagementLetterInclusions({
      includedElements: input.includedElements as string[],
      requiredElements: input.requiredElements as string[],
    }),
  description:
    "Compare included engagement-letter elements with caller-supplied required elements using trimmed case-insensitive labels and report omissions.",
  id: "auditing/engagement-letter-inclusion-elements-checklist",
  inputs: [
    {
      description: "Element labels included in the engagement letter.",
      id: "includedElements",
      kind: "stringList",
      label: "Included elements",
    },
    {
      description: "Element labels that must appear in the engagement letter.",
      id: "requiredElements",
      kind: "stringList",
      label: "Required elements",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Checklist complete" },
    {
      id: "includedCount",
      kind: "integer",
      label: "Included elements",
      minimum: 0,
    },
    {
      id: "missingCount",
      kind: "integer",
      label: "Missing elements",
      minimum: 0,
    },
    {
      id: "missingElements",
      kind: "stringList",
      label: "Missing element labels",
    },
    {
      id: "requiredCount",
      kind: "integer",
      label: "Required elements",
      minimum: 0,
    },
  ],
  title: "Engagement Letter Inclusion Elements Checklist",
});

export const runEngagementLetterInclusion =
  engagementLetterInclusionTool.execute;
export default engagementLetterInclusionTool;

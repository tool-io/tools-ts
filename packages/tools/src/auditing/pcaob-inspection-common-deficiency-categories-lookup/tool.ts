import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InspectionDeficiencyCategoryInput = {
  readonly observedCategories: ReadonlyArray<string>;
  readonly requiredCategories: ReadonlyArray<string>;
  readonly uncategorizedFindings: number;
};

export type InspectionDeficiencyCategoryOutput = {
  readonly categorizationComplete: boolean;
  readonly missingCategories: ReadonlyArray<string>;
  readonly unknownCategories: ReadonlyArray<string>;
};

const normalize = (
  values: ReadonlyArray<string>,
  field: string,
): Set<string> => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "category_list_required");
  return new Set(
    values.map((value, index) => {
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "Category labels must be nonempty strings.",
          "invalid_category",
        );
      return value.trim().toLowerCase();
    }),
  );
};

export const mapInspectionDeficiencyCategories = (
  input: InspectionDeficiencyCategoryInput,
): InspectionDeficiencyCategoryOutput => {
  if (
    !Number.isSafeInteger(input.uncategorizedFindings) ||
    input.uncategorizedFindings < 0
  )
    simpleError(
      "uncategorizedFindings",
      "Uncategorized findings must be a nonnegative whole number.",
      "invalid_uncategorized_count",
    );
  const required = normalize(input.requiredCategories, "requiredCategories");
  const observed = normalize(input.observedCategories, "observedCategories");
  const missingCategories = [...required]
    .filter((category) => !observed.has(category))
    .sort();
  const unknownCategories = [...observed]
    .filter((category) => !required.has(category))
    .sort();
  return {
    categorizationComplete:
      missingCategories.length === 0 &&
      unknownCategories.length === 0 &&
      input.uncategorizedFindings === 0,
    missingCategories,
    unknownCategories,
  };
};

export const inspectionDeficiencyCategoryExample = {
  input: {
    observedCategories: ["Audit Execution", "Custom Category"],
    requiredCategories: ["audit execution", "data integrity"],
    uncategorizedFindings: 1,
  },
  output: {
    categorizationComplete: false,
    missingCategories: ["data integrity"],
    unknownCategories: ["custom category"],
  },
} satisfies ToolExample<
  InspectionDeficiencyCategoryInput,
  InspectionDeficiencyCategoryOutput
>;

export const inspectionDeficiencyCategoryTool = createSimpleTool({
  calculate: (input) =>
    mapInspectionDeficiencyCategories({
      observedCategories: input.observedCategories as string[],
      requiredCategories: input.requiredCategories as string[],
      uncategorizedFindings: input.uncategorizedFindings as number,
    }),
  description:
    "Compare observed inspection deficiency categories with a caller-supplied required set and retain missing, unknown, and uncategorized findings.",
  id: "auditing/pcaob-inspection-common-deficiency-categories-lookup",
  inputs: [
    {
      id: "observedCategories",
      kind: "stringList",
      label: "Observed categories",
    },
    {
      id: "requiredCategories",
      kind: "stringList",
      label: "Required categories",
    },
    {
      description: "Number of findings not assigned to a category.",
      id: "uncategorizedFindings",
      kind: "integer",
      label: "Uncategorized findings",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "categorizationComplete",
      kind: "boolean",
      label: "Categorization complete",
    },
    {
      id: "missingCategories",
      kind: "stringList",
      label: "Missing categories",
    },
    {
      id: "unknownCategories",
      kind: "stringList",
      label: "Unknown categories",
    },
  ],
  title: "PCAOB Inspection Common Deficiency Categories Lookup",
});

export const runInspectionDeficiencyCategory =
  inspectionDeficiencyCategoryTool.execute;
export default inspectionDeficiencyCategoryTool;

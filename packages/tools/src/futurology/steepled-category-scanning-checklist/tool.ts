import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SteepledScanningInput = {
  readonly demographic: boolean;
  readonly economic: boolean;
  readonly environmental: boolean;
  readonly ethical: boolean;
  readonly legal: boolean;
  readonly political: boolean;
  readonly social: boolean;
  readonly technological: boolean;
};

export type SteepledScanningOutput = {
  readonly complete: boolean;
  readonly coveredCategoryCount: number;
  readonly missingCategories: ReadonlyArray<string>;
};

export const checkSteepledScanning = (
  input: SteepledScanningInput,
): SteepledScanningOutput => {
  const categories: ReadonlyArray<
    readonly [keyof SteepledScanningInput, boolean]
  > = [
    ["social", input.social],
    ["technological", input.technological],
    ["economic", input.economic],
    ["environmental", input.environmental],
    ["political", input.political],
    ["legal", input.legal],
    ["ethical", input.ethical],
    ["demographic", input.demographic],
  ];
  for (const [category, covered] of categories)
    if (typeof covered !== "boolean")
      simpleError(
        category,
        `${category} coverage must be a boolean.`,
        "boolean_field_required",
      );
  const missingCategories = categories
    .filter(([, covered]) => !covered)
    .map(([category]) => category);
  return {
    complete: missingCategories.length === 0,
    coveredCategoryCount: categories.length - missingCategories.length,
    missingCategories,
  };
};

export const steepledScanningExample = {
  input: {
    demographic: true,
    economic: true,
    environmental: true,
    ethical: false,
    legal: true,
    political: true,
    social: true,
    technological: true,
  },
  output: {
    complete: false,
    coveredCategoryCount: 7,
    missingCategories: ["ethical"],
  },
} satisfies ToolExample<SteepledScanningInput, SteepledScanningOutput>;

export const steepledScanningTool = createSimpleTool({
  calculate: (input) =>
    checkSteepledScanning({
      demographic: input.demographic as boolean,
      economic: input.economic as boolean,
      environmental: input.environmental as boolean,
      ethical: input.ethical as boolean,
      legal: input.legal as boolean,
      political: input.political as boolean,
      social: input.social as boolean,
      technological: input.technological as boolean,
    }),
  description:
    "Check horizon-scanning coverage across the eight STEEPLED categories: social, technological, economic, environmental, political, legal, ethical, and demographic.",
  id: "futurology/steepled-category-scanning-checklist",
  inputs: [
    { id: "social", kind: "boolean", label: "Social covered" },
    { id: "technological", kind: "boolean", label: "Technological covered" },
    { id: "economic", kind: "boolean", label: "Economic covered" },
    { id: "environmental", kind: "boolean", label: "Environmental covered" },
    { id: "political", kind: "boolean", label: "Political covered" },
    { id: "legal", kind: "boolean", label: "Legal covered" },
    { id: "ethical", kind: "boolean", label: "Ethical covered" },
    { id: "demographic", kind: "boolean", label: "Demographic covered" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "All categories covered" },
    {
      id: "coveredCategoryCount",
      kind: "integer",
      label: "Categories covered",
      maximum: 8,
      minimum: 0,
    },
    {
      id: "missingCategories",
      kind: "stringList",
      label: "Missing categories",
    },
  ],
  title: "STEEPLED Category Scanning Checklist",
});

export const runSteepledScanning = steepledScanningTool.execute;
export default steepledScanningTool;

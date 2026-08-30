import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CollectionCountryCompletenessPercentInput = Readonly<{
  readonly representedCountries: number;
  readonly targetCountries: number;
}>;
export type CollectionCountryCompletenessPercentOutput = Readonly<{
  readonly completionPercent: number;
}>;

export const calculateCollectionCountryCompletenessPercent = (
  x: CollectionCountryCompletenessPercentInput,
): CollectionCountryCompletenessPercentOutput => {
  if (
    !Number.isFinite(x.representedCountries) ||
    x.representedCountries < 0 ||
    !Number.isSafeInteger(x.representedCountries)
  )
    simpleError("representedCountries", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.targetCountries) ||
    x.targetCountries <= 0 ||
    !Number.isSafeInteger(x.targetCountries)
  )
    simpleError("targetCountries", "Provide a positive whole number.");
  if (x.representedCountries > x.targetCountries)
    simpleError(
      "representedCountries",
      "Represented countries cannot exceed target countries.",
    );
  const completionPercent = (x.representedCountries / x.targetCountries) * 100;
  if (!Number.isFinite(completionPercent))
    simpleError(
      "completionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    completionPercent: Object.is(completionPercent, -0) ? 0 : completionPercent,
  };
};

export const example = {
  input: {
    representedCountries: 20,
    targetCountries: 50,
  },
  output: { completionPercent: 40 },
} satisfies ToolExample<
  CollectionCountryCompletenessPercentInput,
  CollectionCountryCompletenessPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/collection-country-completeness-percent",
  title: "Collection Country Completeness Percent",
  description:
    "Measure collection coverage against an explicitly chosen list of target countries.",
  inputs: [
    {
      id: "representedCountries",
      kind: "number",
      label: "Represented Countries",
      unit: "countries",
    },
    {
      id: "targetCountries",
      kind: "number",
      label: "Target Countries",
      unit: "countries",
    },
  ],
  outputs: [
    {
      id: "completionPercent",
      kind: "number",
      label: "Completion Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateCollectionCountryCompletenessPercent({
      representedCountries: input.representedCountries as number,
      targetCountries: input.targetCountries as number,
    }),
});
export const runCollectionCountryCompletenessPercent = tool.execute;
export default tool;

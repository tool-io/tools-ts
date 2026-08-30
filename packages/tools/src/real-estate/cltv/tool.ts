import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CltvInput = Readonly<{
  readonly firstLienBalance: number;
  readonly otherLienBalance: number;
  readonly propertyValue: number;
}>;
export type CltvOutput = Readonly<{
  readonly cltvPercent: number;
}>;

export const calculateCltv = (x: CltvInput): CltvOutput => {
  if (!Number.isFinite(x.firstLienBalance) || x.firstLienBalance < 0)
    simpleError("firstLienBalance", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.otherLienBalance) || x.otherLienBalance < 0)
    simpleError("otherLienBalance", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.propertyValue) || x.propertyValue <= 0)
    simpleError("propertyValue", "Provide a finite positive number.");
  const cltvPercent =
    (100 * (x.firstLienBalance + x.otherLienBalance)) / x.propertyValue;
  if (!Number.isFinite(cltvPercent))
    simpleError(
      "cltvPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { cltvPercent: Object.is(cltvPercent, -0) ? 0 : cltvPercent };
};

export const example = {
  input: {
    firstLienBalance: 70000,
    otherLienBalance: 10000,
    propertyValue: 100000,
  },
  output: { cltvPercent: 80 },
} satisfies ToolExample<CltvInput, CltvOutput>;

export const tool = createSimpleTool({
  id: "real-estate/cltv",
  title: "Cltv",
  description:
    "Combined loan-to-value percentage from first-lien and subordinate balances divided by property value.",
  inputs: [
    {
      id: "firstLienBalance",
      kind: "number",
      label: "First Lien Balance",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "otherLienBalance",
      kind: "number",
      label: "Other Lien Balance",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "propertyValue",
      kind: "number",
      label: "Property Value",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cltvPercent",
      kind: "number",
      label: "Cltv Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateCltv({
      firstLienBalance: input.firstLienBalance as number,
      otherLienBalance: input.otherLienBalance as number,
      propertyValue: input.propertyValue as number,
    }),
});
export const cltvTool = tool;
export const runCltv = tool.execute;
export default tool;

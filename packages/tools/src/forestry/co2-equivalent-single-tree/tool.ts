import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Co2EquivalentSingleTreeInput = Readonly<{
  readonly carbonKilograms: number;
}>;
export type Co2EquivalentSingleTreeOutput = Readonly<{
  readonly co2Kilograms: number;
}>;

export const calculateCo2EquivalentSingleTree = (
  x: Co2EquivalentSingleTreeInput,
): Co2EquivalentSingleTreeOutput => {
  if (!Number.isFinite(x.carbonKilograms) || x.carbonKilograms < 0)
    simpleError("carbonKilograms", "Provide a finite nonnegative number.");
  const co2Kilograms = (x.carbonKilograms * 44) / 12;
  if (!Number.isFinite(co2Kilograms))
    simpleError(
      "co2Kilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { co2Kilograms: Object.is(co2Kilograms, -0) ? 0 : co2Kilograms };
};

export const example = {
  input: {
    carbonKilograms: 500,
  },
  output: { co2Kilograms: 1833.3333333333333 },
} satisfies ToolExample<
  Co2EquivalentSingleTreeInput,
  Co2EquivalentSingleTreeOutput
>;

export const tool = createSimpleTool({
  id: "forestry/co2-equivalent-single-tree",
  title: "Co 2 Equivalent Single Tree",
  description:
    "Carbon-dioxide equivalent mass from tree carbon mass using molecular mass ratio 44/12.",
  inputs: [
    {
      id: "carbonKilograms",
      kind: "number",
      label: "Carbon Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "co2Kilograms", kind: "number", label: "Co 2 Kilograms", unit: "kg" },
  ],
  calculate: (input) =>
    calculateCo2EquivalentSingleTree({
      carbonKilograms: input.carbonKilograms as number,
    }),
});
export const co2EquivalentSingleTreeTool = tool;
export const runCo2EquivalentSingleTree = tool.execute;
export default tool;

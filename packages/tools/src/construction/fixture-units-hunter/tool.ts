import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FixtureUnitsHunterInput = Readonly<{
  readonly fixtureCounts: readonly number[];
  readonly unitsPerFixture: readonly number[];
}>;
export type FixtureUnitsHunterOutput = Readonly<{
  readonly totalFixtureUnits: number;
}>;

export const calculateFixtureUnitsHunter = (
  x: FixtureUnitsHunterInput,
): FixtureUnitsHunterOutput => {
  if (
    !Array.isArray(x.fixtureCounts) ||
    !x.fixtureCounts.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("fixtureCounts", "Provide a finite number list.");
  if (
    !Array.isArray(x.unitsPerFixture) ||
    !x.unitsPerFixture.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("unitsPerFixture", "Provide a finite number list.");
  if (!(
    x.fixtureCounts.length === x.unitsPerFixture.length &&
    x.fixtureCounts.every((v) => Number.isSafeInteger(v) && v >= 0) &&
    x.unitsPerFixture.every((v) => v >= 0)
  ))
    simpleError(
      "fixtureCounts",
      "Provide matching nonnegative fixture counts and units.",
    );
  const totalFixtureUnits = x.fixtureCounts.reduce(
    (sum, count, i) => sum + count * x.unitsPerFixture[i],
    0,
  );
  if (!Number.isFinite(totalFixtureUnits))
    simpleError("totalFixtureUnits", "The inputs produce an invalid result.");
  return {
    totalFixtureUnits: Object.is(totalFixtureUnits, -0) ? 0 : totalFixtureUnits,
  };
};

export const example = {
  input: { fixtureCounts: [2, 1], unitsPerFixture: [2, 3] },
  output: { totalFixtureUnits: 7 },
} satisfies ToolExample<FixtureUnitsHunterInput, FixtureUnitsHunterOutput>;

export const tool = createSimpleTool({
  id: "construction/fixture-units-hunter",
  title: "Hunter Fixture Units",
  description:
    "Sum fixture-unit loads from parallel fixture counts and assigned units per fixture; this is not the Hunter demand-curve conversion to flow.",
  inputs: [
    {
      id: "fixtureCounts",
      kind: "numberList",
      label: "Counts by fixture type",
    },
    {
      id: "unitsPerFixture",
      kind: "numberList",
      label: "Units by fixture type",
    },
  ],
  outputs: [
    { id: "totalFixtureUnits", kind: "number", label: "Total fixture units" },
  ],
  calculate: (input) =>
    calculateFixtureUnitsHunter({
      fixtureCounts: input.fixtureCounts as readonly number[],
      unitsPerFixture: input.unitsPerFixture as readonly number[],
    }),
});
export const fixtureUnitsHunterTool = tool;
export const runFixtureUnitsHunter = tool.execute;
export default tool;

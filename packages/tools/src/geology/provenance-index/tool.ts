import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly zirconTourmalineRutileCounts: readonly number[];
  readonly otherTransparentMineralCounts: readonly number[];
}>;
export type Output = Readonly<{ readonly observedZtrPercent: number }>;
const inputFields = [
  {
    id: "zirconTourmalineRutileCounts",
    label: "Zircon tourmaline rutile counts",
    kind: "numberList",
  },
  {
    id: "otherTransparentMineralCounts",
    label: "Other transparent mineral counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.zirconTourmalineRutileCounts.forEach((v) =>
    nonnegative(v, "zirconTourmalineRutileCounts"),
  );
  input.otherTransparentMineralCounts.forEach((v) =>
    nonnegative(v, "otherTransparentMineralCounts"),
  );
  if (input.zirconTourmalineRutileCounts.length !== 3)
    simpleError("ZTR", "Exactly zircon/tourmaline/rutile counts.");
  [
    ...input.zirconTourmalineRutileCounts,
    ...input.otherTransparentMineralCounts,
  ].forEach((v) => integer(v, "count"));
  const z = sum(input.zirconTourmalineRutileCounts),
    t = positive(z + sum(input.otherTransparentMineralCounts), "total");
  return { observedZtrPercent: (100 * z) / t };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zirconTourmalineRutileCounts: [10, 20, 30],
  otherTransparentMineralCounts: [40, 50],
} satisfies Input;
export const exampleOutput = { observedZtrPercent: 40 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/provenance-index",
  title: "Geology Provenance Index Calculator",
  description:
    "ZTR maturity inventory among identified transparent heavy minerals, excluding opaque fractions; not proof of provenance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "observedZtrPercent", label: "Observed ztr percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      zirconTourmalineRutileCounts:
        value.zirconTourmalineRutileCounts as readonly number[],
      otherTransparentMineralCounts:
        value.otherTransparentMineralCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

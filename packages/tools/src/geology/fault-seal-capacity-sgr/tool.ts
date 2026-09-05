import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly juxtaposedBedThicknessesM: readonly number[];
  readonly clayVolumeFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly shaleGougeRatioPercent: number }>;
const inputFields = [
  {
    id: "juxtaposedBedThicknessesM",
    label: "Juxtaposed bed thicknesses m",
    kind: "numberList",
  },
  {
    id: "clayVolumeFractions",
    label: "Clay volume fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.juxtaposedBedThicknessesM.forEach((v) =>
    positive(v, "juxtaposedBedThicknessesM"),
  );
  input.clayVolumeFractions.forEach((v) => fraction(v, "clayVolumeFractions"));
  aligned(
    input.juxtaposedBedThicknessesM,
    input.clayVolumeFractions,
    "juxtaposedBedThicknessesM",
  );
  return {
    shaleGougeRatioPercent:
      (100 *
        sum(
          input.juxtaposedBedThicknessesM.map(
            (v, i) => v * input.clayVolumeFractions[i],
          ),
        )) /
      sum(input.juxtaposedBedThicknessesM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  juxtaposedBedThicknessesM: [1, 3],
  clayVolumeFractions: [0.2, 0.6],
} satisfies Input;
export const exampleOutput = { shaleGougeRatioPercent: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fault-seal-capacity-sgr",
  title: "Geology Fault Seal Capacity Sgr Calculator",
  description:
    "Throw-window independently mapped clay volume inventory SGR; not calibrated seal pressure or actual fault continuity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "shaleGougeRatioPercent",
      label: "Shale gouge ratio percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      juxtaposedBedThicknessesM:
        value.juxtaposedBedThicknessesM as readonly number[],
      clayVolumeFractions: value.clayVolumeFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

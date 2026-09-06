import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedInitialOilSaturations: readonly number[];
  readonly observedResidualOilSaturations: readonly number[];
  readonly observedMatchedCorePoreVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly poreWeightedObservedDisplacementEfficiency: number;
}>;
const inputFields = [
  {
    id: "observedInitialOilSaturations",
    label: "Observed initial oil saturations",
    kind: "numberList",
  },
  {
    id: "observedResidualOilSaturations",
    label: "Observed residual oil saturations",
    kind: "numberList",
  },
  {
    id: "observedMatchedCorePoreVolumesM3",
    label: "Observed matched core pore volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedCorePoreVolumesM3.forEach((v) =>
    positive(v, "observedMatchedCorePoreVolumesM3"),
  );
  input.observedInitialOilSaturations.forEach((v) =>
    fraction(v, "observedInitialOilSaturations"),
  );
  input.observedResidualOilSaturations.forEach((v) =>
    fraction(v, "observedResidualOilSaturations"),
  );
  aligned(
    input.observedInitialOilSaturations,
    input.observedResidualOilSaturations,
    "observedInitialOilSaturations",
  );
  aligned(
    input.observedInitialOilSaturations,
    input.observedMatchedCorePoreVolumesM3,
    "observedInitialOilSaturations",
  );
  const initial = sum(
    input.observedInitialOilSaturations.map(
      (v, i) => v * input.observedMatchedCorePoreVolumesM3[i],
    ),
  );
  positive(initial, "initial oil");
  return {
    poreWeightedObservedDisplacementEfficiency:
      sum(
        input.observedInitialOilSaturations.map(
          (v, i) =>
            (v - input.observedResidualOilSaturations[i]) *
            input.observedMatchedCorePoreVolumesM3[i],
        ),
      ) / initial,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInitialOilSaturations: [0.8, 0.6],
  observedResidualOilSaturations: [0.2, 0.3],
  observedMatchedCorePoreVolumesM3: [1, 2],
} satisfies Input;
export const exampleOutput = {
  poreWeightedObservedDisplacementEfficiency: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/displacement-efficiency",
  title: "Petroleum Displacement Efficiency Calculator",
  description:
    "Audit actual pore-weighted core initial/residual oil displacement, signed apparent losses retained; not sweep contact fraction or reservoir-wide recovery guarantee. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "poreWeightedObservedDisplacementEfficiency",
      label: "Pore weighted observed displacement efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInitialOilSaturations:
        value.observedInitialOilSaturations as readonly number[],
      observedResidualOilSaturations:
        value.observedResidualOilSaturations as readonly number[],
      observedMatchedCorePoreVolumesM3:
        value.observedMatchedCorePoreVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

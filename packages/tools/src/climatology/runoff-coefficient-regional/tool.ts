import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMatchedRunoffVolumesM3: readonly number[];
  readonly observedMatchedRainVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledObservedRunoffCoefficient: number;
}>;
const inputFields = [
  {
    id: "observedMatchedRunoffVolumesM3",
    label: "Observed matched runoff volumes m3",
    kind: "numberList",
  },
  {
    id: "observedMatchedRainVolumesM3",
    label: "Observed matched rain volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedRainVolumesM3.forEach((v) =>
    positive(v, "observedMatchedRainVolumesM3"),
  );
  input.observedMatchedRunoffVolumesM3.forEach((v) =>
    nonnegative(v, "observedMatchedRunoffVolumesM3"),
  );
  aligned(
    input.observedMatchedRunoffVolumesM3,
    input.observedMatchedRainVolumesM3,
    "observedMatchedRunoffVolumesM3",
  );
  const q = sum(input.observedMatchedRunoffVolumesM3),
    p = sum(input.observedMatchedRainVolumesM3);
  return { pooledObservedRunoffCoefficient: q / p };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedRunoffVolumesM3: [2, 3],
  observedMatchedRainVolumesM3: [10, 20],
} satisfies Input;
export const exampleOutput = {
  pooledObservedRunoffCoefficient: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/runoff-coefficient-regional",
  title: "Runoff Coefficient Regional Estimate Lookup",
  description:
    "Pool observed runoff over matched rain-volume exposure. Ratios above one are preserved rather than clamped because stored water or other inflows may contribute. Requires independently matched catchment windows; not a fixed regional coefficient or forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedRunoffCoefficient",
      label: "Pooled observed runoff coefficient",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedRunoffVolumesM3:
        value.observedMatchedRunoffVolumesM3 as readonly number[],
      observedMatchedRainVolumesM3:
        value.observedMatchedRainVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

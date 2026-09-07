import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBentGuideThroughPowerWatts: readonly number[];
  readonly observedMatchedStraightGuideWatts: readonly number[];
  readonly observedBendCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedExcessBendingDbPerBend: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBentGuideThroughPowerWatts",
    label: "Observed bent guide through power watts",
    kind: "numberList",
  },
  {
    id: "observedMatchedStraightGuideWatts",
    label: "Observed matched straight guide watts",
    kind: "numberList",
  },
  {
    id: "observedBendCounts",
    label: "Observed bend counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBentGuideThroughPowerWatts.forEach((v) =>
    positive(v, "observedBentGuideThroughPowerWatts"),
  );
  input.observedMatchedStraightGuideWatts.forEach((v) =>
    positive(v, "observedMatchedStraightGuideWatts"),
  );
  aligned(
    input.observedBentGuideThroughPowerWatts,
    input.observedMatchedStraightGuideWatts,
    "observedBentGuideThroughPowerWatts",
  );
  aligned(
    input.observedBentGuideThroughPowerWatts,
    input.observedBendCounts,
    "observedBentGuideThroughPowerWatts",
  );
  input.observedBendCounts.forEach((v) => bounded(v, "bends", 1, 1000000));
  return {
    observedExcessBendingDbPerBend:
      input.observedBentGuideThroughPowerWatts.map(
        (v, i) =>
          (-10 * Math.log10(v / input.observedMatchedStraightGuideWatts[i])) /
          input.observedBendCounts[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBentGuideThroughPowerWatts: [0.8, 0.5],
  observedMatchedStraightGuideWatts: [1, 1],
  observedBendCounts: [2, 1],
} satisfies Input;
export const exampleOutput = {
  observedExcessBendingDbPerBend: [0.484550065040282, 3.010299956639812],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-waveguide-bending-loss",
  title: "Semiconductor Silicon Photonics Waveguide Bending Loss Calculator",
  description:
    "Extract actual excess bent-versus-straight waveguide insertion loss per observed bend, signed gains retained; not generic attenuation×length or radius prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedExcessBendingDbPerBend",
      label: "Observed excess bending db per bend",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBentGuideThroughPowerWatts:
        value.observedBentGuideThroughPowerWatts as readonly number[],
      observedMatchedStraightGuideWatts:
        value.observedMatchedStraightGuideWatts as readonly number[],
      observedBendCounts: value.observedBendCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedStaticMatchedRonOhm: readonly number[];
  readonly observedDynamicMatchedRonOhm: readonly number[];
  readonly observedStressToReadDelaysSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly dynamicRonFactors: readonly number[];
  readonly signedDynamicRonExcessOhm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedStaticMatchedRonOhm",
    label: "Observed static matched ron ohm",
    kind: "numberList",
  },
  {
    id: "observedDynamicMatchedRonOhm",
    label: "Observed dynamic matched ron ohm",
    kind: "numberList",
  },
  {
    id: "observedStressToReadDelaysSeconds",
    label: "Observed stress to read delays seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStaticMatchedRonOhm.forEach((v) =>
    positive(v, "observedStaticMatchedRonOhm"),
  );
  input.observedDynamicMatchedRonOhm.forEach((v) =>
    positive(v, "observedDynamicMatchedRonOhm"),
  );
  input.observedStressToReadDelaysSeconds.forEach((v) =>
    nonnegative(v, "observedStressToReadDelaysSeconds"),
  );
  aligned(
    input.observedStaticMatchedRonOhm,
    input.observedDynamicMatchedRonOhm,
    "observedStaticMatchedRonOhm",
  );
  aligned(
    input.observedStaticMatchedRonOhm,
    input.observedStressToReadDelaysSeconds,
    "observedStaticMatchedRonOhm",
  );
  return {
    dynamicRonFactors: input.observedDynamicMatchedRonOhm.map(
      (v, i) => v / input.observedStaticMatchedRonOhm[i],
    ),
    signedDynamicRonExcessOhm: input.observedDynamicMatchedRonOhm.map(
      (v, i) => v - input.observedStaticMatchedRonOhm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStaticMatchedRonOhm: [1, 2],
  observedDynamicMatchedRonOhm: [1.5, 4],
  observedStressToReadDelaysSeconds: [1, 2],
} satisfies Input;
export const exampleOutput = {
  dynamicRonFactors: [1.5, 2],
  signedDynamicRonExcessOhm: [0.5, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/gan-hemt-dynamic-ron",
  title: "Semiconductor Gan Hemt Dynamic Ron Calculator",
  description:
    "Audit actual matched static/dynamic GaN HEMT on-resistance with explicit stress/read delay evidence, no generic thermal Ron temperature model or current-collapse identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "dynamicRonFactors",
      label: "Dynamic ron factors",
      kind: "numberList",
    },
    {
      id: "signedDynamicRonExcessOhm",
      label: "Signed dynamic ron excess ohm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStaticMatchedRonOhm:
        value.observedStaticMatchedRonOhm as readonly number[],
      observedDynamicMatchedRonOhm:
        value.observedDynamicMatchedRonOhm as readonly number[],
      observedStressToReadDelaysSeconds:
        value.observedStressToReadDelaysSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

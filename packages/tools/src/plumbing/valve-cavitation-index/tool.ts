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
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedValveUpstreamAbsoluteKpa: readonly number[];
  readonly observedValveDownstreamAbsoluteKpa: readonly number[];
  readonly callerMatchedFluidVaporAbsoluteKpa: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerUpstreamReferencedCavitationIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedValveUpstreamAbsoluteKpa",
    label: "Observed valve upstream absolute kpa",
    kind: "numberList",
  },
  {
    id: "observedValveDownstreamAbsoluteKpa",
    label: "Observed valve downstream absolute kpa",
    kind: "numberList",
  },
  {
    id: "callerMatchedFluidVaporAbsoluteKpa",
    label: "Caller matched fluid vapor absolute kpa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedValveUpstreamAbsoluteKpa.forEach((v) =>
    positive(v, "observedValveUpstreamAbsoluteKpa"),
  );
  input.observedValveDownstreamAbsoluteKpa.forEach((v) =>
    positive(v, "observedValveDownstreamAbsoluteKpa"),
  );
  input.callerMatchedFluidVaporAbsoluteKpa.forEach((v) =>
    nonnegative(v, "callerMatchedFluidVaporAbsoluteKpa"),
  );
  aligned(
    input.observedValveUpstreamAbsoluteKpa,
    input.observedValveDownstreamAbsoluteKpa,
    "observedValveUpstreamAbsoluteKpa",
  );
  aligned(
    input.observedValveUpstreamAbsoluteKpa,
    input.callerMatchedFluidVaporAbsoluteKpa,
    "observedValveUpstreamAbsoluteKpa",
  );
  return {
    callerUpstreamReferencedCavitationIndices:
      input.observedValveUpstreamAbsoluteKpa.map((v, i) => {
        const drop = v - input.observedValveDownstreamAbsoluteKpa[i];
        if (drop === 0)
          simpleError(
            "drop",
            "Nonzero actual valve pressure difference required.",
          );
        return (v - input.callerMatchedFluidVaporAbsoluteKpa[i]) / drop;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedValveUpstreamAbsoluteKpa: [200, 150],
  observedValveDownstreamAbsoluteKpa: [100, 160],
  callerMatchedFluidVaporAbsoluteKpa: [10, 10],
} satisfies Input;
export const exampleOutput = {
  callerUpstreamReferencedCavitationIndices: [1.9, -14],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/valve-cavitation-index",
  title: "Plumbing Valve Cavitation Index Calculator",
  description:
    "Audit actual upstream-referenced (P1−Pv)/(P1−P2) valve index with explicit absolute pressures, signed reversed drops retained; alternative sigma conventions distinct, not cavitation safety classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerUpstreamReferencedCavitationIndices",
      label: "Caller upstream referenced cavitation indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedValveUpstreamAbsoluteKpa:
        value.observedValveUpstreamAbsoluteKpa as readonly number[],
      observedValveDownstreamAbsoluteKpa:
        value.observedValveDownstreamAbsoluteKpa as readonly number[],
      callerMatchedFluidVaporAbsoluteKpa:
        value.callerMatchedFluidVaporAbsoluteKpa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

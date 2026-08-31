import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedFirnLineElevationsM: readonly number[];
  readonly independentElaEstimatesM: readonly number[];
  readonly callerMaximumAbsoluteProxyOffsetM: number;
}>;
export type Output = Readonly<{
  readonly signedFirnLineMinusElaOffsetsM: readonly number[];
  readonly beyondCallerProxyToleranceIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFirnLineElevationsM",
    label: "Observed firn line elevations m",
    kind: "numberList",
  },
  {
    id: "independentElaEstimatesM",
    label: "Independent ela estimates m",
    kind: "numberList",
  },
  {
    id: "callerMaximumAbsoluteProxyOffsetM",
    label: "Caller maximum absolute proxy offset m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumAbsoluteProxyOffsetM,
    "callerMaximumAbsoluteProxyOffsetM",
  );
  aligned(
    input.observedFirnLineElevationsM,
    input.independentElaEstimatesM,
    "observedFirnLineElevationsM",
  );
  const offsets = input.observedFirnLineElevationsM.map(
    (v, i) => v - input.independentElaEstimatesM[i],
  );
  return {
    signedFirnLineMinusElaOffsetsM: offsets,
    beyondCallerProxyToleranceIndices: offsets.flatMap((v, i) =>
      Math.abs(v) > input.callerMaximumAbsoluteProxyOffsetM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFirnLineElevationsM: [2000, 2100],
  independentElaEstimatesM: [1900, 2200],
  callerMaximumAbsoluteProxyOffsetM: 100,
} satisfies Input;
export const exampleOutput = {
  signedFirnLineMinusElaOffsetsM: [100, -100],
  beyondCallerProxyToleranceIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/firn-line-versus-ela-offset",
  title: "Firn Line Versus ELA Offset Calculator",
  description:
    "Audit actual firn-line proxy against independent ELA estimates with signed elevation offsets and caller tolerance; same supplied datum, no asserting firn line equals ELA or elevation transformation.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFirnLineMinusElaOffsetsM",
      label: "Signed firn line minus ela offsets m",
      kind: "numberList",
    },
    {
      id: "beyondCallerProxyToleranceIndices",
      label: "Beyond caller proxy tolerance indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFirnLineElevationsM:
        value.observedFirnLineElevationsM as readonly number[],
      independentElaEstimatesM:
        value.independentElaEstimatesM as readonly number[],
      callerMaximumAbsoluteProxyOffsetM:
        value.callerMaximumAbsoluteProxyOffsetM as number,
    }),
});
export const run = tool.execute;
export default tool;

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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedZeroBottomholeRateM3Day: number;
  readonly observedReservoirPressurePa: number;
  readonly observedBottomholePressuresPa: readonly number[];
  readonly callerSaturatedVogelBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly vogelModeledRatesM3Day: readonly number[];
}>;
const inputFields = [
  {
    id: "callerIndependentlyEstablishedZeroBottomholeRateM3Day",
    label: "Caller independently established zero bottomhole rate m3 day",
    kind: "number",
  },
  {
    id: "observedReservoirPressurePa",
    label: "Observed reservoir pressure pa",
    kind: "number",
  },
  {
    id: "observedBottomholePressuresPa",
    label: "Observed bottomhole pressures pa",
    kind: "numberList",
  },
  {
    id: "callerSaturatedVogelBranchVerified",
    label: "Caller saturated vogel branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedReservoirPressurePa, "observedReservoirPressurePa");
  nonnegative(
    input.callerIndependentlyEstablishedZeroBottomholeRateM3Day,
    "callerIndependentlyEstablishedZeroBottomholeRateM3Day",
  );
  input.observedBottomholePressuresPa.forEach((v) =>
    nonnegative(v, "observedBottomholePressuresPa"),
  );
  if (!input.callerSaturatedVogelBranchVerified)
    simpleError(
      "branch",
      "Independent saturated solution-gas drive Vogel branch verification required.",
    );
  return {
    vogelModeledRatesM3Day: input.observedBottomholePressuresPa.map((v) => {
      if (v > input.observedReservoirPressurePa)
        simpleError(
          "pressure",
          "Bottomhole≤reservoir on this production branch.",
        );
      const x = v / input.observedReservoirPressurePa;
      return (
        input.callerIndependentlyEstablishedZeroBottomholeRateM3Day *
        (1 - 0.2 * x - 0.8 * x * x)
      );
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyEstablishedZeroBottomholeRateM3Day: 100,
  observedReservoirPressurePa: 10,
  observedBottomholePressuresPa: [0, 5, 10],
  callerSaturatedVogelBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  vogelModeledRatesM3Day: [100, 70, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/nodal-analysis-inflow-ipr-vogel",
  title: "Petroleum Nodal Analysis Inflow IPR Vogel Calculator",
  description:
    "Named saturated Vogel IPR q/qmax=1−.2p/pr−.8(p/pr)², explicit independent qmax/branch; not linearPI, general multiphase inflow or production recommendation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "vogelModeledRatesM3Day",
      label: "Vogel modeled rates m3 day",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyEstablishedZeroBottomholeRateM3Day:
        value.callerIndependentlyEstablishedZeroBottomholeRateM3Day as number,
      observedReservoirPressurePa: value.observedReservoirPressurePa as number,
      observedBottomholePressuresPa:
        value.observedBottomholePressuresPa as readonly number[],
      callerSaturatedVogelBranchVerified:
        value.callerSaturatedVogelBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;

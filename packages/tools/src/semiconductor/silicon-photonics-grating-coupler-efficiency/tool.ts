import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCoupledOpticalWatts: readonly number[];
  readonly observedIncidentOpticalWatts: readonly number[];
  readonly callerMatchedPathTransmissionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly pathCorrectedGratingCouplingFractions: readonly number[];
  readonly rawObservedCouplingFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCoupledOpticalWatts",
    label: "Observed coupled optical watts",
    kind: "numberList",
  },
  {
    id: "observedIncidentOpticalWatts",
    label: "Observed incident optical watts",
    kind: "numberList",
  },
  {
    id: "callerMatchedPathTransmissionFractions",
    label: "Caller matched path transmission fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIncidentOpticalWatts.forEach((v) =>
    positive(v, "observedIncidentOpticalWatts"),
  );
  input.callerMatchedPathTransmissionFractions.forEach((v) =>
    positive(v, "callerMatchedPathTransmissionFractions"),
  );
  input.observedCoupledOpticalWatts.forEach((v) =>
    nonnegative(v, "observedCoupledOpticalWatts"),
  );
  input.callerMatchedPathTransmissionFractions.forEach((v) =>
    fraction(v, "callerMatchedPathTransmissionFractions"),
  );
  aligned(
    input.observedCoupledOpticalWatts,
    input.observedIncidentOpticalWatts,
    "observedCoupledOpticalWatts",
  );
  aligned(
    input.observedCoupledOpticalWatts,
    input.callerMatchedPathTransmissionFractions,
    "observedCoupledOpticalWatts",
  );
  return {
    pathCorrectedGratingCouplingFractions:
      input.observedCoupledOpticalWatts.map(
        (v, i) =>
          v /
          input.observedIncidentOpticalWatts[i] /
          input.callerMatchedPathTransmissionFractions[i],
      ),
    rawObservedCouplingFractions: input.observedCoupledOpticalWatts.map(
      (v, i) => v / input.observedIncidentOpticalWatts[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCoupledOpticalWatts: [1, 2],
  observedIncidentOpticalWatts: [2, 4],
  callerMatchedPathTransmissionFractions: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  pathCorrectedGratingCouplingFractions: [1, 1],
  rawObservedCouplingFractions: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-grating-coupler-efficiency",
  title:
    "Semiconductor Silicon Photonics Grating Coupler Efficiency Calculator",
  description:
    "Audit actual grating-coupled power with independently established remaining path transmission; >1 correction signals mismatch not clipped, distinct from generic optical efficiency.",
  inputs: inputFields,
  outputs: [
    {
      id: "pathCorrectedGratingCouplingFractions",
      label: "Path corrected grating coupling fractions",
      kind: "numberList",
    },
    {
      id: "rawObservedCouplingFractions",
      label: "Raw observed coupling fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCoupledOpticalWatts:
        value.observedCoupledOpticalWatts as readonly number[],
      observedIncidentOpticalWatts:
        value.observedIncidentOpticalWatts as readonly number[],
      callerMatchedPathTransmissionFractions:
        value.callerMatchedPathTransmissionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

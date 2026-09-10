import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedMonomolecularA: number;
  readonly callerCalibratedBimolecularB: number;
  readonly callerCalibratedAugerC: number;
  readonly independentlyEstablishedCarrierDensities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedMonomolecularA",
    label: "Caller calibrated monomolecular a",
    kind: "number",
  },
  {
    id: "callerCalibratedBimolecularB",
    label: "Caller calibrated bimolecular b",
    kind: "number",
  },
  {
    id: "callerCalibratedAugerC",
    label: "Caller calibrated auger c",
    kind: "number",
  },
  {
    id: "independentlyEstablishedCarrierDensities",
    label: "Independently established carrier densities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerCalibratedMonomolecularA,
    input.callerCalibratedBimolecularB,
    input.callerCalibratedAugerC,
  ].forEach((v) => nonnegative(v, "coefficient"));
  if (!input.independentlyEstablishedCarrierDensities.length)
    simpleError("density", "Actual operating points.");
  input.independentlyEstablishedCarrierDensities.forEach((n) => {
    positive(n, "density");
    positive(
      input.callerCalibratedMonomolecularA +
        input.callerCalibratedBimolecularB * n +
        input.callerCalibratedAugerC * n * n,
      "total-rate",
    );
  });
  return {
    conditionalAbcRadiativeFractions:
      input.independentlyEstablishedCarrierDensities.map(
        (n) =>
          (input.callerCalibratedBimolecularB * n) /
          (input.callerCalibratedMonomolecularA +
            input.callerCalibratedBimolecularB * n +
            input.callerCalibratedAugerC * n * n),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedMonomolecularA: 1,
    callerCalibratedBimolecularB: 1,
    callerCalibratedAugerC: 1,
    independentlyEstablishedCarrierDensities: [1, 2],
  },
  output: {
    result: {
      conditionalAbcRadiativeFractions: [
        0.3333333333333333, 0.2857142857142857,
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-efficiency-internal-vs-current",
  title: "Semiconductor Quantum Efficiency Internal Vs Current Calculator",
  description:
    "Explicit calibrated ABC n=p internal radiative fraction across independently established operating carrier densities. Current-to-density relation is external; not existing lifetime ratio, measured extraction efficiency or automatic droop attribution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly strandNominalDiameterM: number;
  readonly callerInitialStrandStressPa: number;
  readonly callerMatchedMeanTransferBondPa: number;
}>;
export type Output = Readonly<{
  readonly uniformBondPrestressTransferLengthM: number;
}>;
const inputFields = [
  {
    id: "strandNominalDiameterM",
    label: "Strand nominal diameter m",
    kind: "number",
  },
  {
    id: "callerInitialStrandStressPa",
    label: "Caller initial strand stress pa",
    kind: "number",
  },
  {
    id: "callerMatchedMeanTransferBondPa",
    label: "Caller matched mean transfer bond pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.strandNominalDiameterM, "strandNominalDiameterM");
  positive(
    input.callerMatchedMeanTransferBondPa,
    "callerMatchedMeanTransferBondPa",
  );
  nonnegative(input.callerInitialStrandStressPa, "callerInitialStrandStressPa");
  return {
    uniformBondPrestressTransferLengthM:
      (input.strandNominalDiameterM * input.callerInitialStrandStressPa) /
      (4 * input.callerMatchedMeanTransferBondPa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  strandNominalDiameterM: 0.01,
  callerInitialStrandStressPa: 100,
  callerMatchedMeanTransferBondPa: 5,
} satisfies Input;
export const exampleOutput = {
  uniformBondPrestressTransferLengthM: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/transfer-length-prestress",
  title: "Prestress Transfer Length Calculator",
  description:
    "Uniform circular strand bond equilibrium lp=dσ/(4τ), caller independently establishes mean transfer bond, not universal diameter multiplier or development length. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniformBondPrestressTransferLengthM",
      label: "Uniform bond prestress transfer length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      strandNominalDiameterM: value.strandNominalDiameterM as number,
      callerInitialStrandStressPa: value.callerInitialStrandStressPa as number,
      callerMatchedMeanTransferBondPa:
        value.callerMatchedMeanTransferBondPa as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUsablePhotonFlux: number;
  readonly callerCalibratedReferencePhotonFlux: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUsablePhotonFlux",
    label: "Independently measured usable photon flux",
    kind: "number",
  },
  {
    id: "callerCalibratedReferencePhotonFlux",
    label: "Caller calibrated reference photon flux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredUsablePhotonFlux, "flux");
  positive(input.callerCalibratedReferencePhotonFlux, "reference");
  return {
    conditionalReferencePhotonFluxFraction:
      input.independentlyMeasuredUsablePhotonFlux /
      input.callerCalibratedReferencePhotonFlux,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUsablePhotonFlux: 100,
    callerCalibratedReferencePhotonFlux: 200,
  },
  output: { result: { conditionalReferencePhotonFluxFraction: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/photosynthesis-photon-flux-rededge-checker",
  title: "Photosynthesis Photon Flux Red Edge Viability Checker",
  description:
    "Actual independently wavelength-integrated usable photon flux relative to a matched organism/action-spectrum reference. No universal red-edge photosynthesis viability threshold or inferred actual photosynthesis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

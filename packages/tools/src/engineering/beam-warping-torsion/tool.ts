import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerResolvedSectionBimomentNm2: number;
  readonly observedSectorialCoordinateM2: number;
  readonly callerWarpingConstantM6: number;
}>;
export type Output = Readonly<{ readonly signedWarpingNormalStressPa: number }>;
const inputFields = [
  {
    id: "callerResolvedSectionBimomentNm2",
    label: "Caller resolved section bimoment nm2",
    kind: "number",
  },
  {
    id: "observedSectorialCoordinateM2",
    label: "Observed sectorial coordinate m2",
    kind: "number",
  },
  {
    id: "callerWarpingConstantM6",
    label: "Caller warping constant m6",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWarpingConstantM6, "callerWarpingConstantM6");
  return {
    signedWarpingNormalStressPa:
      (input.callerResolvedSectionBimomentNm2 *
        input.observedSectorialCoordinateM2) /
      input.callerWarpingConstantM6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerResolvedSectionBimomentNm2: 10,
  observedSectorialCoordinateM2: 0.2,
  callerWarpingConstantM6: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedWarpingNormalStressPa: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/beam-warping-torsion",
  title: "Beam Warping Torsion Calculator",
  description:
    "Vlasov warping normal stress Bω/Iω at caller independently resolved sectorial coordinate, not Saint-Venant torque shear. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedWarpingNormalStressPa",
      label: "Signed warping normal stress pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerResolvedSectionBimomentNm2:
        value.callerResolvedSectionBimomentNm2 as number,
      observedSectorialCoordinateM2:
        value.observedSectorialCoordinateM2 as number,
      callerWarpingConstantM6: value.callerWarpingConstantM6 as number,
    }),
});
export const run = tool.execute;
export default tool;

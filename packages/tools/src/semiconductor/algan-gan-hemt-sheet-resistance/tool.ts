import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedHemtFourProbeVolts: readonly number[];
  readonly observedHemtFourProbeAmps: readonly number[];
  readonly callerVerifiedFourProbeGeometryFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly extractedHemtSheetOhms: readonly number[];
}>;
const inputFields = [
  {
    id: "observedHemtFourProbeVolts",
    label: "Observed hemt four probe volts",
    kind: "numberList",
  },
  {
    id: "observedHemtFourProbeAmps",
    label: "Observed hemt four probe amps",
    kind: "numberList",
  },
  {
    id: "callerVerifiedFourProbeGeometryFactors",
    label: "Caller verified four probe geometry factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHemtFourProbeAmps.forEach((v) =>
    positive(v, "observedHemtFourProbeAmps"),
  );
  input.callerVerifiedFourProbeGeometryFactors.forEach((v) =>
    positive(v, "callerVerifiedFourProbeGeometryFactors"),
  );
  aligned(
    input.observedHemtFourProbeVolts,
    input.observedHemtFourProbeAmps,
    "observedHemtFourProbeVolts",
  );
  aligned(
    input.observedHemtFourProbeVolts,
    input.callerVerifiedFourProbeGeometryFactors,
    "observedHemtFourProbeVolts",
  );
  return {
    extractedHemtSheetOhms: input.observedHemtFourProbeVolts.map(
      (v, i) =>
        (v / input.observedHemtFourProbeAmps[i]) *
        input.callerVerifiedFourProbeGeometryFactors[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHemtFourProbeVolts: [1, 2],
  observedHemtFourProbeAmps: [1, 1],
  callerVerifiedFourProbeGeometryFactors: [2, 3],
} satisfies Input;
export const exampleOutput = {
  extractedHemtSheetOhms: [2, 6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/algan-gan-hemt-sheet-resistance",
  title: "Semiconductor AlGaN Gan Hemt Sheet Resistance Calculator",
  description:
    "Extract actual AlGaN/GaN HEMT four-probe sheet resistance using independently verified finite-sample probe geometry, not forward dopant-film conductivity.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedHemtSheetOhms",
      label: "Extracted hemt sheet ohms",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHemtFourProbeVolts:
        value.observedHemtFourProbeVolts as readonly number[],
      observedHemtFourProbeAmps:
        value.observedHemtFourProbeAmps as readonly number[],
      callerVerifiedFourProbeGeometryFactors:
        value.callerVerifiedFourProbeGeometryFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

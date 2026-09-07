import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, points } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedHybridBondCentersMicrons: readonly (readonly number[])[];
  readonly callerNominalHybridBondPitchMicrons: number;
}>;
export type Output = Readonly<{
  readonly observedMinimumHybridCenterSeparationMicrons: number;
  readonly signedMinimumPitchMarginMicrons: number;
}>;
const inputFields = [
  {
    id: "observedHybridBondCentersMicrons",
    label: "Observed hybrid bond centers microns",
    kind: "matrix",
  },
  {
    id: "callerNominalHybridBondPitchMicrons",
    label: "Caller nominal hybrid bond pitch microns",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerNominalHybridBondPitchMicrons,
    "callerNominalHybridBondPitchMicrons",
  );
  points(input.observedHybridBondCentersMicrons);
  if (input.observedHybridBondCentersMicrons.length < 2)
    simpleError(
      "centers",
      "At least two actual local hybrid-bond centers required.",
    );
  let min = Infinity;
  input.observedHybridBondCentersMicrons.forEach((p, i) =>
    input.observedHybridBondCentersMicrons.slice(i + 1).forEach((q) => {
      min = Math.min(min, Math.hypot(p[0] - q[0], p[1] - q[1]));
    }),
  );
  return {
    observedMinimumHybridCenterSeparationMicrons: min,
    signedMinimumPitchMarginMicrons:
      min - input.callerNominalHybridBondPitchMicrons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHybridBondCentersMicrons: [
    [0, 0],
    [2, 0],
    [2, 2],
  ],
  callerNominalHybridBondPitchMicrons: 2,
} satisfies Input;
export const exampleOutput = {
  observedMinimumHybridCenterSeparationMicrons: 2,
  signedMinimumPitchMarginMicrons: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/hybrid-bonding-pitch",
  title: "Semiconductor Hybrid Bonding Pitch Calculator",
  description:
    "Audit measured local hybrid-bond nearest-center spacing against independent nominal pitch; bounded128 points, not array density or placement/registration/shorting guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMinimumHybridCenterSeparationMicrons",
      label: "Observed minimum hybrid center separation microns",
      kind: "number",
    },
    {
      id: "signedMinimumPitchMarginMicrons",
      label: "Signed minimum pitch margin microns",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHybridBondCentersMicrons:
        value.observedHybridBondCentersMicrons as readonly (readonly number[])[],
      callerNominalHybridBondPitchMicrons:
        value.callerNominalHybridBondPitchMicrons as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly measuredSewerInternalDiametersM: readonly number[];
  readonly callerMatchedManningRoughness: readonly number[];
  readonly observedPositiveSewerSlopes: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledFullFlowVelocitiesMetersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredSewerInternalDiametersM",
    label: "Measured sewer internal diameters m",
    kind: "numberList",
  },
  {
    id: "callerMatchedManningRoughness",
    label: "Caller matched manning roughness",
    kind: "numberList",
  },
  {
    id: "observedPositiveSewerSlopes",
    label: "Observed positive sewer slopes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredSewerInternalDiametersM.forEach((v) =>
    positive(v, "measuredSewerInternalDiametersM"),
  );
  input.callerMatchedManningRoughness.forEach((v) =>
    positive(v, "callerMatchedManningRoughness"),
  );
  input.observedPositiveSewerSlopes.forEach((v) =>
    nonnegative(v, "observedPositiveSewerSlopes"),
  );
  aligned(
    input.measuredSewerInternalDiametersM,
    input.callerMatchedManningRoughness,
    "measuredSewerInternalDiametersM",
  );
  aligned(
    input.measuredSewerInternalDiametersM,
    input.observedPositiveSewerSlopes,
    "measuredSewerInternalDiametersM",
  );
  return {
    modeledFullFlowVelocitiesMetersSecond:
      input.measuredSewerInternalDiametersM.map(
        (v, i) =>
          ((v / 4) ** (2 / 3) *
            Math.sqrt(input.observedPositiveSewerSlopes[i])) /
          input.callerMatchedManningRoughness[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSewerInternalDiametersM: [0.2, 0.4],
  callerMatchedManningRoughness: [0.01, 0.02],
  observedPositiveSewerSlopes: [0.01, 0.01],
} satisfies Input;
export const exampleOutput = {
  modeledFullFlowVelocitiesMetersSecond: [
    1.3572088082974536, 1.077217345015942,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/sewer-velocity-at-full-flow",
  title: "Plumbing Sewer Velocity At Full Flow Calculator",
  description:
    "Evaluate matched actual sewer runs under named SI Manning full circular gravity-flow assumption, hydraulic radius D/4; not pressurized-flow velocity or partial-depth solver, no code sizing.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFullFlowVelocitiesMetersSecond",
      label: "Modeled full flow velocities meters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSewerInternalDiametersM:
        value.measuredSewerInternalDiametersM as readonly number[],
      callerMatchedManningRoughness:
        value.callerMatchedManningRoughness as readonly number[],
      observedPositiveSewerSlopes:
        value.observedPositiveSewerSlopes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

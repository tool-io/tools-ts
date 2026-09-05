import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly seismicMomentNM: number;
  readonly independentCircularRuptureRadiusM: number;
}>;
export type Output = Readonly<{ readonly bruneCircularStressDropPa: number }>;
const inputFields = [
  { id: "seismicMomentNM", label: "Seismic moment n m", kind: "number" },
  {
    id: "independentCircularRuptureRadiusM",
    label: "Independent circular rupture radius m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentCircularRuptureRadiusM,
    "independentCircularRuptureRadiusM",
  );
  nonnegative(input.seismicMomentNM, "seismicMomentNM");
  return {
    bruneCircularStressDropPa:
      (7 * input.seismicMomentNM) /
      (16 * input.independentCircularRuptureRadiusM ** 3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seismicMomentNM: 16,
  independentCircularRuptureRadiusM: 1,
} satisfies Input;
export const exampleOutput = { bruneCircularStressDropPa: 7 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/seismic-stress-drop",
  title: "Geology Seismic Stress Drop Calculator",
  description:
    "Circular crack7M0/(16r³) from independent rupture radius, not moment-magnitude conversion or forecast. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "bruneCircularStressDropPa",
      label: "Brune circular stress drop pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seismicMomentNM: value.seismicMomentNM as number,
      independentCircularRuptureRadiusM:
        value.independentCircularRuptureRadiusM as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly initialAlBeRatio: number;
  readonly measuredAlBeRatio: number;
  readonly alDecayPerMa: number;
  readonly beDecayPerMa: number;
}>;
export type Output = Readonly<{ readonly simpleBurialAgeMa: number }>;
const inputFields = [
  { id: "initialAlBeRatio", label: "Initial al be ratio", kind: "number" },
  { id: "measuredAlBeRatio", label: "Measured al be ratio", kind: "number" },
  { id: "alDecayPerMa", label: "Al decay per ma", kind: "number" },
  { id: "beDecayPerMa", label: "Be decay per ma", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialAlBeRatio, "initialAlBeRatio");
  positive(input.measuredAlBeRatio, "measuredAlBeRatio");
  positive(input.alDecayPerMa, "alDecayPerMa");
  positive(input.beDecayPerMa, "beDecayPerMa");
  const delta = positive(
    input.alDecayPerMa - input.beDecayPerMa,
    "Al decay faster than Be",
  );
  if (input.measuredAlBeRatio > input.initialAlBeRatio)
    simpleError("ratio", "Nonnegative no-postburial-production branch.");
  return {
    simpleBurialAgeMa:
      Math.log(input.initialAlBeRatio / input.measuredAlBeRatio) / delta,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialAlBeRatio: 8,
  measuredAlBeRatio: 2,
  alDecayPerMa: 2,
  beDecayPerMa: 1,
} satisfies Input;
export const exampleOutput = {
  simpleBurialAgeMa: 1.3862943611198906,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/aluminum-26-beryllium-10-burial-age",
  title: "Geology Aluminum 26 Beryllium 10 Burial Age Calculator",
  description:
    "Al26/Be10 ratio burial decay with explicit initial ratio and decay constants; assumes no postburial production, no inferred complex history. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "simpleBurialAgeMa", label: "Simple burial age ma", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      initialAlBeRatio: value.initialAlBeRatio as number,
      measuredAlBeRatio: value.measuredAlBeRatio as number,
      alDecayPerMa: value.alDecayPerMa as number,
      beDecayPerMa: value.beDecayPerMa as number,
    }),
});
export const run = tool.execute;
export default tool;

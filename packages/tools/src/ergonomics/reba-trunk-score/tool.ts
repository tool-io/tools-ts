import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly signedTrunkFlexionDegrees: number;
  readonly twistedOrSideBent: boolean;
}>;
export type Output = Readonly<{ readonly rebaTrunkScore: number }>;
const inputFields = [
  {
    id: "signedTrunkFlexionDegrees",
    label: "Signed trunk flexion degrees",
    kind: "number",
  },
  { id: "twistedOrSideBent", label: "Twisted or side bent", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.signedTrunkFlexionDegrees < -90 ||
    input.signedTrunkFlexionDegrees > 180
  )
    simpleError("angle", "Observed signed extension/flexion−90..180 degrees.");
  const a = input.signedTrunkFlexionDegrees;
  return {
    rebaTrunkScore:
      (a === 0 ? 1 : a >= -20 && a <= 20 ? 2 : a < -20 || a <= 60 ? 3 : 4) +
      (input.twistedOrSideBent ? 1 : 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedTrunkFlexionDegrees: 30,
  twistedOrSideBent: true,
} satisfies Input;
export const exampleOutput = { rebaTrunkScore: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reba-trunk-score",
  title: "REBA Trunk Score Calculator",
  description:
    "REBA trunk posture component only: upright 1, extension/flexion through 20 degrees 2, extension beyond 20 or flexion through 60 degrees 3, flexion beyond 60 degrees 4, twist/sidebend +1; no full score. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis or work-safety approval.",
  inputs: inputFields,
  outputs: [
    { id: "rebaTrunkScore", label: "Reba trunk score", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      signedTrunkFlexionDegrees: value.signedTrunkFlexionDegrees as number,
      twistedOrSideBent: value.twistedOrSideBent as boolean,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly horizontalMultiplier: number;
  readonly verticalMultiplier: number;
  readonly distanceMultiplier: number;
  readonly asymmetryMultiplier: number;
  readonly frequencyMultiplier: number;
  readonly couplingMultiplier: number;
}>;
export type Output = Readonly<{ readonly revisedNioshRwlKg: number }>;
const inputFields = [
  {
    id: "horizontalMultiplier",
    label: "Horizontal multiplier",
    kind: "number",
  },
  { id: "verticalMultiplier", label: "Vertical multiplier", kind: "number" },
  { id: "distanceMultiplier", label: "Distance multiplier", kind: "number" },
  { id: "asymmetryMultiplier", label: "Asymmetry multiplier", kind: "number" },
  { id: "frequencyMultiplier", label: "Frequency multiplier", kind: "number" },
  { id: "couplingMultiplier", label: "Coupling multiplier", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.horizontalMultiplier, "horizontalMultiplier");
  fraction(input.verticalMultiplier, "verticalMultiplier");
  fraction(input.distanceMultiplier, "distanceMultiplier");
  fraction(input.asymmetryMultiplier, "asymmetryMultiplier");
  fraction(input.frequencyMultiplier, "frequencyMultiplier");
  fraction(input.couplingMultiplier, "couplingMultiplier");
  return {
    revisedNioshRwlKg:
      23 *
      input.horizontalMultiplier *
      input.verticalMultiplier *
      input.distanceMultiplier *
      input.asymmetryMultiplier *
      input.frequencyMultiplier *
      input.couplingMultiplier,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalMultiplier: 0.5,
  verticalMultiplier: 1,
  distanceMultiplier: 1,
  asymmetryMultiplier: 1,
  frequencyMultiplier: 1,
  couplingMultiplier: 1,
} satisfies Input;
export const exampleOutput = { revisedNioshRwlKg: 11.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-rwl-base",
  title: "NIOSH RWL Load Constant Base Calculator",
  description:
    "RevisedNIOSH23kgload constant times six independently established multipliers, task applicability and all domain restrictions external; not safe load recommendation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "revisedNioshRwlKg", label: "Revised niosh rwl kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      horizontalMultiplier: value.horizontalMultiplier as number,
      verticalMultiplier: value.verticalMultiplier as number,
      distanceMultiplier: value.distanceMultiplier as number,
      asymmetryMultiplier: value.asymmetryMultiplier as number,
      frequencyMultiplier: value.frequencyMultiplier as number,
      couplingMultiplier: value.couplingMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;

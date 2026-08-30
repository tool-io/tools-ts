import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lactateSecretedMmol: number;
  readonly glucoseConsumedMmol: number;
}>;
export type Output = Readonly<{
  readonly lactatePerGlucose: number;
  readonly carbonRecoveryPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.lactateSecretedMmol < 0 || input.glucoseConsumedMmol <= 0)
    simpleError("glucoseConsumedMmol", "Glucose consumed must be positive.");
  const lactatePerGlucose =
    input.lactateSecretedMmol / input.glucoseConsumedMmol;
  return {
    lactatePerGlucose,
    carbonRecoveryPercent: (lactatePerGlucose / 2) * 100,
  };
};
export const exampleInput = {
  lactateSecretedMmol: 20,
  glucoseConsumedMmol: 10,
} satisfies Input;
export const exampleOutput = {
  lactatePerGlucose: 2,
  carbonRecoveryPercent: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/lactate-glucose-yield",
  title: "Lactate Glucose Yield",
  description:
    "Compute apparent lactate yield per glucose and two-lactate carbon recovery.",
  inputs: [
    {
      id: "lactateSecretedMmol",
      kind: "number",
      label: "Lactate secreted mmol",
    },
    {
      id: "glucoseConsumedMmol",
      kind: "number",
      label: "Glucose consumed mmol",
    },
  ],
  outputs: [
    { id: "lactatePerGlucose", kind: "number", label: "Lactate per glucose" },
    {
      id: "carbonRecoveryPercent",
      kind: "number",
      label: "Carbon recovery percent",
    },
  ],
  calculate: (value) =>
    calculate({
      lactateSecretedMmol: value.lactateSecretedMmol as number,
      glucoseConsumedMmol: value.glucoseConsumedMmol as number,
    }),
});
export const run = tool.execute;
export default tool;

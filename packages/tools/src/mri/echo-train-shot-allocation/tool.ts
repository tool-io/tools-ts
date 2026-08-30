import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly requiredPhaseLines: number;
  readonly maximumEchoesPerShot: number;
}>;
export type Output = Readonly<{
  readonly shotEchoCounts: readonly number[];
  readonly shotCount: number;
}>;
const inputFields = [
  { id: "requiredPhaseLines", label: "Required phase lines", kind: "integer" },
  {
    id: "maximumEchoesPerShot",
    label: "Maximum echoes per shot",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.requiredPhaseLines, "requiredPhaseLines", 1);
  count(input.maximumEchoesPerShot, "maximumEchoesPerShot", 1);
  const shotCount = Math.ceil(
    input.requiredPhaseLines / input.maximumEchoesPerShot,
  );
  if (shotCount > 100000)
    simpleError(
      "requiredPhaseLines",
      "Shot plan exceeds generated-value limit.",
    );
  const shotEchoCounts = Array.from({ length: shotCount }, (_, i) =>
    Math.min(
      input.maximumEchoesPerShot,
      input.requiredPhaseLines - i * input.maximumEchoesPerShot,
    ),
  );
  return { shotEchoCounts, shotCount };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredPhaseLines: 130,
  maximumEchoesPerShot: 32,
} satisfies Input;
export const exampleOutput = {
  shotEchoCounts: [32, 32, 32, 32, 2],
  shotCount: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/echo-train-shot-allocation",
  title: "Echo Train Length",
  description:
    "Allocate required phase lines into bounded echo trains, retaining a short final shot; echo weighting, k-space ordering and sequence-specific ETL definitions are external.",
  inputs: inputFields,
  outputs: [
    { id: "shotEchoCounts", label: "Shot echo counts", kind: "numberList" },
    { id: "shotCount", label: "Shot count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      requiredPhaseLines: value.requiredPhaseLines as number,
      maximumEchoesPerShot: value.maximumEchoesPerShot as number,
    }),
});
export const run = tool.execute;
export default tool;

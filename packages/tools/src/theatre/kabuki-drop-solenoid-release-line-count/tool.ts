import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  unique,
  points,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly releasePointIds: readonly string[];
  readonly assignedReleaseCircuitNumbers: readonly number[];
  readonly observedCircuitReleaseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly pointsPerReleaseCircuit: readonly number[];
  readonly pointsWithoutObservedRelease: readonly string[];
}>;
const inputFields = [
  { id: "releasePointIds", label: "Release point ids", kind: "stringList" },
  {
    id: "assignedReleaseCircuitNumbers",
    label: "Assigned release circuit numbers",
    kind: "numberList",
  },
  {
    id: "observedCircuitReleaseFlags",
    label: "Observed circuit release flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.releasePointIds, "points");
  aligned(input.releasePointIds, input.assignedReleaseCircuitNumbers, "points");
  binary(input.observedCircuitReleaseFlags, "release");
  if (
    !input.observedCircuitReleaseFlags.length ||
    input.observedCircuitReleaseFlags.length > 128
  )
    simpleError("circuits", "1–128 observed release circuits required.");
  const counts = Array<number>(input.observedCircuitReleaseFlags.length).fill(
      0,
    ),
    missing: string[] = [];
  input.assignedReleaseCircuitNumbers.forEach((v, i) => {
    bounded(v, "circuit", 0, counts.length - 1);
    counts[v]++;
    if (!input.observedCircuitReleaseFlags[v])
      missing.push(input.releasePointIds[i]);
  });
  return {
    pointsPerReleaseCircuit: counts,
    pointsWithoutObservedRelease: missing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  releasePointIds: ["a", "b", "c"],
  assignedReleaseCircuitNumbers: [0, 0, 1],
  observedCircuitReleaseFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  pointsPerReleaseCircuit: [2, 1],
  pointsWithoutObservedRelease: ["c"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/kabuki-drop-solenoid-release-line-count",
  title: "Kabuki Drop Solenoid Release Line Count Tool",
  description:
    "Reconcile actual Kabuki release-point to circuit inventory against observed circuit release evidence; no solenoid current/wiring procedure, mechanical synchronization or safe drop readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "pointsPerReleaseCircuit",
      label: "Points per release circuit",
      kind: "numberList",
    },
    {
      id: "pointsWithoutObservedRelease",
      label: "Points without observed release",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      releasePointIds: value.releasePointIds as readonly string[],
      assignedReleaseCircuitNumbers:
        value.assignedReleaseCircuitNumbers as readonly number[],
      observedCircuitReleaseFlags:
        value.observedCircuitReleaseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

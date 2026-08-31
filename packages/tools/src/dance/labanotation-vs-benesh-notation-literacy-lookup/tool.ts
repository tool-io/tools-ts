import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  matrixFlags,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerNotationSystemIds: readonly string[];
  readonly callerRequiredNotationTaskIds: readonly string[];
  readonly observedTaskPassFlags: readonly (readonly number[])[];
  readonly taskEvidenceFlags: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly knownPassedTaskCountsBySystem: readonly number[];
  readonly knownFailedTaskCountsBySystem: readonly number[];
  readonly unknownTaskCountsBySystem: readonly number[];
  readonly systemsWithAllCallerTasksVerified: readonly string[];
}>;
const inputFields = [
  {
    id: "callerNotationSystemIds",
    label: "Caller notation system ids",
    kind: "stringList",
  },
  {
    id: "callerRequiredNotationTaskIds",
    label: "Caller required notation task ids",
    kind: "stringList",
  },
  {
    id: "observedTaskPassFlags",
    label: "Observed task pass flags",
    kind: "matrix",
  },
  { id: "taskEvidenceFlags", label: "Task evidence flags", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerNotationSystemIds, "systems");
  unique(input.callerRequiredNotationTaskIds, "tasks");
  matrixFlags(
    input.observedTaskPassFlags,
    input.callerRequiredNotationTaskIds.length,
  );
  matrixFlags(
    input.taskEvidenceFlags,
    input.callerRequiredNotationTaskIds.length,
  );
  aligned(
    input.callerNotationSystemIds,
    input.observedTaskPassFlags,
    "systems",
  );
  aligned(input.callerNotationSystemIds, input.taskEvidenceFlags, "systems");
  const passed = input.observedTaskPassFlags.map(
      (r, i) =>
        r.filter((v, j) => v === 1 && input.taskEvidenceFlags[i][j] === 1)
          .length,
    ),
    failed = input.observedTaskPassFlags.map(
      (r, i) =>
        r.filter((v, j) => v === 0 && input.taskEvidenceFlags[i][j] === 1)
          .length,
    ),
    unknown = input.taskEvidenceFlags.map(
      (r) => r.filter((v) => v === 0).length,
    );
  return {
    knownPassedTaskCountsBySystem: passed,
    knownFailedTaskCountsBySystem: failed,
    unknownTaskCountsBySystem: unknown,
    systemsWithAllCallerTasksVerified: input.callerNotationSystemIds.filter(
      (_, i) => passed[i] === input.callerRequiredNotationTaskIds.length,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNotationSystemIds: ["Labanotation", "Benesh"],
  callerRequiredNotationTaskIds: ["read", "write"],
  observedTaskPassFlags: [
    [1, 0],
    [1, 1],
  ],
  taskEvidenceFlags: [
    [1, 1],
    [1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  knownPassedTaskCountsBySystem: [1, 1],
  knownFailedTaskCountsBySystem: [1, 0],
  unknownTaskCountsBySystem: [0, 1],
  systemsWithAllCallerTasksVerified: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/labanotation-vs-benesh-notation-literacy-lookup",
  title: "Labanotation vs Benesh Notation Literacy Lookup",
  description:
    "Audit actual caller-defined notation literacy task evidence per system with pass/fail/unknown distinction; no automatic translation, cultural hierarchy or certification from checklist.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPassedTaskCountsBySystem",
      label: "Known passed task counts by system",
      kind: "numberList",
    },
    {
      id: "knownFailedTaskCountsBySystem",
      label: "Known failed task counts by system",
      kind: "numberList",
    },
    {
      id: "unknownTaskCountsBySystem",
      label: "Unknown task counts by system",
      kind: "numberList",
    },
    {
      id: "systemsWithAllCallerTasksVerified",
      label: "Systems with all caller tasks verified",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerNotationSystemIds:
        value.callerNotationSystemIds as readonly string[],
      callerRequiredNotationTaskIds:
        value.callerRequiredNotationTaskIds as readonly string[],
      observedTaskPassFlags:
        value.observedTaskPassFlags as readonly (readonly number[])[],
      taskEvidenceFlags:
        value.taskEvidenceFlags as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

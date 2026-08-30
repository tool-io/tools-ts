import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned, ledger } from "../shared.js";
export type Input = Readonly<{
  readonly objectFormatCodes: readonly number[];
  readonly callerValueClassCodes: readonly number[];
  readonly callerFormatValuePriorityMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly salvagePriorityCodes: readonly number[];
  readonly stableCallerSalvageOrderIndices: readonly number[];
}>;
const inputFields = [
  { id: "objectFormatCodes", label: "Object format codes", kind: "numberList" },
  {
    id: "callerValueClassCodes",
    label: "Caller value class codes",
    kind: "numberList",
  },
  {
    id: "callerFormatValuePriorityMatrix",
    label: "Caller format value priority matrix",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.objectFormatCodes.forEach((v) => count(v, "objectFormatCodes"));
  input.callerValueClassCodes.forEach((v) => count(v, "callerValueClassCodes"));
  aligned(
    input.objectFormatCodes,
    input.callerValueClassCodes,
    "objectFormatCodes",
  );
  ledger(input.callerFormatValuePriorityMatrix, "policy");
  if (
    input.objectFormatCodes.some(
      (v, i) =>
        v >= input.callerFormatValuePriorityMatrix.length ||
        input.callerValueClassCodes[i] >=
          input.callerFormatValuePriorityMatrix[0].length,
    )
  )
    simpleError("codes", "Format/value codes must address declared matrix.");
  const p = input.objectFormatCodes.map(
    (v, i) =>
      input.callerFormatValuePriorityMatrix[v][input.callerValueClassCodes[i]],
  );
  return {
    salvagePriorityCodes: p,
    stableCallerSalvageOrderIndices: p
      .map((_, i) => i)
      .sort((a, b) => p[b] - p[a] || a - b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  objectFormatCodes: [0, 1, 0],
  callerValueClassCodes: [1, 0, 0],
  callerFormatValuePriorityMatrix: [
    [1, 4],
    [3, 2],
  ],
} satisfies Input;
export const exampleOutput = {
  salvagePriorityCodes: [4, 3, 1],
  stableCallerSalvageOrderIndices: [0, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/salvage-priority-rank-resolver",
  title: "Salvage Priority Rank by Format Value Matrix Resolver",
  description:
    "Rank explicit object format/value policy cells with stable ties; no invented significance, treatment feasibility or permission to expose staff to unsafe salvage conditions.",
  inputs: inputFields,
  outputs: [
    {
      id: "salvagePriorityCodes",
      label: "Salvage priority codes",
      kind: "numberList",
    },
    {
      id: "stableCallerSalvageOrderIndices",
      label: "Stable caller salvage order indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      objectFormatCodes: value.objectFormatCodes as readonly number[],
      callerValueClassCodes: value.callerValueClassCodes as readonly number[],
      callerFormatValuePriorityMatrix:
        value.callerFormatValuePriorityMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerArgon2MemoryKibPerInvocation: number;
  readonly callerConcurrentInvocations: number;
  readonly callerAvailableMemoryKib: number;
  readonly callerArgon2ParallelismLanes: number;
}>;
export type Output = Readonly<{
  readonly totalCallerInvocationMemoryKib: number;
  readonly remainingMemoryKib: number;
  readonly memoryBudgetFits: boolean;
  readonly minimumEightKibPerLaneSatisfied: boolean;
}>;
const inputFields = [
  {
    id: "callerArgon2MemoryKibPerInvocation",
    label: "Caller argon2 memory kib per invocation",
    kind: "number",
  },
  {
    id: "callerConcurrentInvocations",
    label: "Caller concurrent invocations",
    kind: "number",
  },
  {
    id: "callerAvailableMemoryKib",
    label: "Caller available memory kib",
    kind: "number",
  },
  {
    id: "callerArgon2ParallelismLanes",
    label: "Caller argon2 parallelism lanes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerArgon2MemoryKibPerInvocation, "memory", 8, 2 ** 30);
  bounded(input.callerConcurrentInvocations, "concurrency", 1, 10000);
  bounded(input.callerAvailableMemoryKib, "available", 0, 2 ** 40);
  bounded(input.callerArgon2ParallelismLanes, "lanes", 1, 128);
  const total =
    input.callerArgon2MemoryKibPerInvocation *
    input.callerConcurrentInvocations;
  return {
    totalCallerInvocationMemoryKib: total,
    remainingMemoryKib: input.callerAvailableMemoryKib - total,
    memoryBudgetFits: total <= input.callerAvailableMemoryKib,
    minimumEightKibPerLaneSatisfied:
      input.callerArgon2MemoryKibPerInvocation >=
      8 * input.callerArgon2ParallelismLanes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerArgon2MemoryKibPerInvocation: 1024,
  callerConcurrentInvocations: 4,
  callerAvailableMemoryKib: 8192,
  callerArgon2ParallelismLanes: 2,
} satisfies Input;
export const exampleOutput = {
  totalCallerInvocationMemoryKib: 4096,
  remainingMemoryKib: 4096,
  memoryBudgetFits: true,
  minimumEightKibPerLaneSatisfied: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/argon2-memory-parameter-tradeoff-note-lookup",
  title: "Argon2 Memory Tradeoff Note Lookup",
  description:
    "Budget Argon2 memory parameter as TOTAL per invocation (not per lane) and concurrent instances;8KiB/lane structural screen only, no secure parameter recommendation or runtime memory guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalCallerInvocationMemoryKib",
      label: "Total caller invocation memory kib",
      kind: "number",
    },
    { id: "remainingMemoryKib", label: "Remaining memory kib", kind: "number" },
    { id: "memoryBudgetFits", label: "Memory budget fits", kind: "boolean" },
    {
      id: "minimumEightKibPerLaneSatisfied",
      label: "Minimum eight kib per lane satisfied",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerArgon2MemoryKibPerInvocation:
        value.callerArgon2MemoryKibPerInvocation as number,
      callerConcurrentInvocations: value.callerConcurrentInvocations as number,
      callerAvailableMemoryKib: value.callerAvailableMemoryKib as number,
      callerArgon2ParallelismLanes:
        value.callerArgon2ParallelismLanes as number,
    }),
});
export const run = tool.execute;
export default tool;

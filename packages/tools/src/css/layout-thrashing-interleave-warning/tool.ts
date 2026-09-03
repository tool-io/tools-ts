import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  pick,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly operationKinds: readonly string[];
  readonly callerLayoutInvalidatingFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly potentialForcedLayoutReadIndices: readonly number[];
}>;
const inputFields = [
  { id: "operationKinds", label: "Operation kinds", kind: "stringList" },
  {
    id: "callerLayoutInvalidatingFlags",
    label: "Caller layout invalidating flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerLayoutInvalidatingFlags, "callerLayoutInvalidatingFlags");
  aligned(
    input.operationKinds,
    input.callerLayoutInvalidatingFlags,
    "operationKinds",
  );
  let dirty = false;
  const hits: number[] = [];
  input.operationKinds.forEach((v, i) => {
    pick(v, { write: 0, read: 1, other: 2 }, "operation");
    if (v === "write" && input.callerLayoutInvalidatingFlags[i]) dirty = true;
    else if (v === "read" && dirty) {
      hits.push(i);
      dirty = false;
    }
  });
  return { potentialForcedLayoutReadIndices: hits };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  operationKinds: ["write", "read", "read", "write", "read"],
  callerLayoutInvalidatingFlags: [1, 0, 0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  potentialForcedLayoutReadIndices: [1, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/layout-thrashing-interleave-warning",
  title: "Layout Thrashing Read/Write Interleave Warning",
  description:
    "Observed operation trace potential forced-layout reads after caller confirmed invalidating writes; read assumed layout-dependent, no browser flush timing or elapsed cost inferred. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialForcedLayoutReadIndices",
      label: "Potential forced layout read indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      operationKinds: value.operationKinds as readonly string[],
      callerLayoutInvalidatingFlags:
        value.callerLayoutInvalidatingFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly firstStackingContextPath: readonly string[];
  readonly secondStackingContextPath: readonly string[];
  readonly firstLocalZIndex: number;
  readonly secondLocalZIndex: number;
}>;
export type Output = Readonly<{
  readonly localZIndicesDirectlyComparable: boolean;
  readonly commonContextDepth: number;
}>;
const inputFields = [
  {
    id: "firstStackingContextPath",
    label: "First stacking context path",
    kind: "stringList",
  },
  {
    id: "secondStackingContextPath",
    label: "Second stacking context path",
    kind: "stringList",
  },
  { id: "firstLocalZIndex", label: "First local z index", kind: "number" },
  { id: "secondLocalZIndex", label: "Second local z index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.firstStackingContextPath.length ||
    !input.secondStackingContextPath.length
  )
    simpleError("paths", "Explicit root-to-containing-stacking-context paths.");
  let d = 0;
  while (
    d <
      Math.min(
        input.firstStackingContextPath.length,
        input.secondStackingContextPath.length,
      ) &&
    input.firstStackingContextPath[d] === input.secondStackingContextPath[d]
  )
    d++;
  return {
    localZIndicesDirectlyComparable:
      d === input.firstStackingContextPath.length &&
      d === input.secondStackingContextPath.length,
    commonContextDepth: d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstStackingContextPath: ["root", "a"],
  secondStackingContextPath: ["root", "b"],
  firstLocalZIndex: 999,
  secondLocalZIndex: 1,
} satisfies Input;
export const exampleOutput = {
  localZIndicesDirectlyComparable: false,
  commonContextDepth: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/z-index-stacking-context-boundary-checker",
  title: "z-index Stacking Context Boundary Check",
  description:
    "Audit supplied containing stacking-context ancestry; descendant local z-index cannot escape ancestor contexts, and unrelated roots are not ordered. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "localZIndicesDirectlyComparable",
      label: "Local z indices directly comparable",
      kind: "boolean",
    },
    { id: "commonContextDepth", label: "Common context depth", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstStackingContextPath:
        value.firstStackingContextPath as readonly string[],
      secondStackingContextPath:
        value.secondStackingContextPath as readonly string[],
      firstLocalZIndex: value.firstLocalZIndex as number,
      secondLocalZIndex: value.secondLocalZIndex as number,
    }),
});
export const run = tool.execute;
export default tool;

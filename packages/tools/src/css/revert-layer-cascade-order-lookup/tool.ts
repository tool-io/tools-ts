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
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerOrderedLayerNames: readonly string[];
  readonly callerWinningTokens: readonly string[];
  readonly currentLayerIndex: number;
  readonly importantDeclaration: boolean;
}>;
export type Output = Readonly<{
  readonly resolvedPriorLayerToken: string;
  readonly selectedLayerIndex: number;
}>;
const inputFields = [
  {
    id: "callerOrderedLayerNames",
    label: "Caller ordered layer names",
    kind: "stringList",
  },
  {
    id: "callerWinningTokens",
    label: "Caller winning tokens",
    kind: "stringList",
  },
  { id: "currentLayerIndex", label: "Current layer index", kind: "number" },
  {
    id: "importantDeclaration",
    label: "Important declaration",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerOrderedLayerNames, "layers");
  aligned(input.callerOrderedLayerNames, input.callerWinningTokens, "layers");
  bounded(
    input.currentLayerIndex,
    "layer",
    0,
    input.callerWinningTokens.length - 1,
  );
  if (input.callerWinningTokens[input.currentLayerIndex] !== "revert-layer")
    simpleError("current", "Selected winning token must be revert-layer.");
  const step = input.importantDeclaration ? 1 : -1;
  for (
    let i = input.currentLayerIndex + step;
    i >= 0 && i < input.callerWinningTokens.length;
    i += step
  )
    if (input.callerWinningTokens[i] !== "revert-layer")
      return {
        resolvedPriorLayerToken: input.callerWinningTokens[i],
        selectedLayerIndex: i,
      };
  return simpleError(
    "coverage",
    "No prior layer evidence; origin rollback not supplied.",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOrderedLayerNames: ["base", "theme", "local"],
  callerWinningTokens: ["black", "blue", "revert-layer"],
  currentLayerIndex: 2,
  importantDeclaration: false,
} satisfies Input;
export const exampleOutput = {
  resolvedPriorLayerToken: "blue",
  selectedLayerIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/revert-layer-cascade-order-lookup",
  title: "@layer revert-layer Cascade Order Lookup",
  description:
    "Resolve revert-layer within caller ordered declared layers, importance reverses layer order; origin/unlayered/specificity competition must already be resolved externally. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedPriorLayerToken",
      label: "Resolved prior layer token",
      kind: "string",
    },
    { id: "selectedLayerIndex", label: "Selected layer index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerOrderedLayerNames:
        value.callerOrderedLayerNames as readonly string[],
      callerWinningTokens: value.callerWinningTokens as readonly string[],
      currentLayerIndex: value.currentLayerIndex as number,
      importantDeclaration: value.importantDeclaration as boolean,
    }),
});
export const run = tool.execute;
export default tool;

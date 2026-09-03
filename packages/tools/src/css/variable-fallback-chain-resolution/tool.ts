import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly variableNames: readonly string[];
  readonly literalTokens: readonly string[];
  readonly referencedVariables: readonly string[];
  readonly fallbackTokens: readonly string[];
  readonly queryVariable: string;
}>;
export type Output = Readonly<{
  readonly resolvedToken: string;
  readonly visitedVariables: readonly string[];
}>;
const inputFields = [
  { id: "variableNames", label: "Variable names", kind: "stringList" },
  { id: "literalTokens", label: "Literal tokens", kind: "stringList" },
  {
    id: "referencedVariables",
    label: "Referenced variables",
    kind: "stringList",
  },
  { id: "fallbackTokens", label: "Fallback tokens", kind: "stringList" },
  { id: "queryVariable", label: "Query variable", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.variableNames, "variables");
  for (const v of [
    input.literalTokens,
    input.referencedVariables,
    input.fallbackTokens,
  ])
    aligned(input.variableNames, v, "variables");
  if (input.variableNames.some((v) => !/^--[A-Za-z0-9_-]+$/.test(v)))
    simpleError("name", "Explicit supported custom property names.");
  const seen = new Set<string>(),
    visited: string[] = [];
  const walk = (name: string): string => {
    const i = input.variableNames.indexOf(name);
    if (i < 0)
      simpleError(
        "reference",
        "Missing referenced variable with no caller fallback.",
      );
    if (seen.has(name))
      simpleError(
        "cycle",
        "Cyclic variable graph is invalid; fallback does not make cycle valid.",
      );
    seen.add(name);
    visited.push(name);
    const ref = input.referencedVariables[i];
    if (ref) {
      if (input.literalTokens[i])
        simpleError(
          "node",
          "Each node is literal or single var reference, not both.",
        );
      if (!input.variableNames.includes(ref)) {
        if (!input.fallbackTokens[i])
          simpleError(
            "fallback",
            "Missing reference requires explicit nonempty fallback token.",
          );
        return input.fallbackTokens[i];
      }
      return walk(ref);
    }
    if (!input.literalTokens[i])
      simpleError("literal", "Explicit nonempty terminal literal token.");
    return input.literalTokens[i];
  };
  return {
    resolvedToken: walk(input.queryVariable),
    visitedVariables: visited,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  variableNames: ["--a", "--b"],
  literalTokens: ["", "red"],
  referencedVariables: ["--b", ""],
  fallbackTokens: ["blue", ""],
  queryVariable: "--a",
} satisfies Input;
export const exampleOutput = {
  resolvedToken: "red",
  visitedVariables: ["--a", "--b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/variable-fallback-chain-resolution",
  title: "CSS Variable Fallback Chain Resolution",
  description:
    "Resolve caller-declared bounded single-var-reference/literal fallback graph with cycle detection, not arbitrary CSS token parsing, registered-property types or property-specific invalid-value fallback. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "resolvedToken", label: "Resolved token", kind: "string" },
    { id: "visitedVariables", label: "Visited variables", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      variableNames: value.variableNames as readonly string[],
      literalTokens: value.literalTokens as readonly string[],
      referencedVariables: value.referencedVariables as readonly string[],
      fallbackTokens: value.fallbackTokens as readonly string[],
      queryVariable: value.queryVariable as string,
    }),
});
export const run = tool.execute;
export default tool;

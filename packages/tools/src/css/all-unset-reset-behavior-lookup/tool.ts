import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, binary } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly propertyNames: readonly string[];
  readonly propertyNormallyInheritedFlags: readonly number[];
}>;
export type Output = Readonly<{ readonly resetActions: readonly string[] }>;
const inputFields = [
  { id: "propertyNames", label: "Property names", kind: "stringList" },
  {
    id: "propertyNormallyInheritedFlags",
    label: "Property normally inherited flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.propertyNormallyInheritedFlags,
    "propertyNormallyInheritedFlags",
  );
  aligned(
    input.propertyNames,
    input.propertyNormallyInheritedFlags,
    "propertyNames",
  );
  return {
    resetActions: input.propertyNames.map((p, i) =>
      p === "direction" || p === "unicode-bidi" || p.startsWith("--")
        ? "excluded"
        : input.propertyNormallyInheritedFlags[i]
          ? "inherit"
          : "initial",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  propertyNames: ["color", "direction", "--x"],
  propertyNormallyInheritedFlags: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  resetActions: ["inherit", "excluded", "excluded"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/all-unset-reset-behavior-lookup",
  title: "all:unset Reset Behavior Lookup",
  description:
    "all:unset resets ordinary properties by inheritedness, excludes direction/unicode-bidi/custom properties, caller independently supplies property inheritance metadata. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "resetActions", label: "Reset actions", kind: "stringList" }],
  calculate: (value) =>
    calculate({
      propertyNames: value.propertyNames as readonly string[],
      propertyNormallyInheritedFlags:
        value.propertyNormallyInheritedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

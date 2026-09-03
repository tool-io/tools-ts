import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly primaryInputHoverCapability: string;
  readonly primaryInputPointerPrecision: string;
  readonly callerAnyHoverAvailable: boolean;
}>;
export type Output = Readonly<{
  readonly hoverNoneQueryMatches: boolean;
  readonly touchDeviceIdentityEstablished: boolean;
}>;
const inputFields = [
  {
    id: "primaryInputHoverCapability",
    label: "Primary input hover capability",
    kind: "string",
  },
  {
    id: "primaryInputPointerPrecision",
    label: "Primary input pointer precision",
    kind: "string",
  },
  {
    id: "callerAnyHoverAvailable",
    label: "Caller any hover available",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  pick(input.primaryInputHoverCapability, { none: 0, hover: 1 }, "hover");
  pick(
    input.primaryInputPointerPrecision,
    { none: 0, coarse: 1, fine: 2 },
    "pointer",
  );
  return {
    hoverNoneQueryMatches: input.primaryInputHoverCapability === "none",
    touchDeviceIdentityEstablished: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  primaryInputHoverCapability: "none",
  primaryInputPointerPrecision: "coarse",
  callerAnyHoverAvailable: true,
} satisfies Input;
export const exampleOutput = {
  hoverNoneQueryMatches: true,
  touchDeviceIdentityEstablished: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/media-hover-none-touch-classifier",
  title: "@media hover:none Touch Device Classifier",
  description:
    "Primary hover:none capability does not identify a touch device; secondary any-hover may differ, no hardware label inferred. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "hoverNoneQueryMatches",
      label: "Hover none query matches",
      kind: "boolean",
    },
    {
      id: "touchDeviceIdentityEstablished",
      label: "Touch device identity established",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      primaryInputHoverCapability: value.primaryInputHoverCapability as string,
      primaryInputPointerPrecision:
        value.primaryInputPointerPrecision as string,
      callerAnyHoverAvailable: value.callerAnyHoverAvailable as boolean,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly keyword: string;
  readonly isRegistered: boolean;
  readonly callerParentComputedToken: string;
  readonly callerRegisteredInitialToken: string;
}>;
export type Output = Readonly<{
  readonly resolvedCustomPropertyToken: string;
  readonly guaranteedInvalid: boolean;
}>;
const inputFields = [
  { id: "keyword", label: "Keyword", kind: "string" },
  { id: "isRegistered", label: "Is registered", kind: "boolean" },
  {
    id: "callerParentComputedToken",
    label: "Caller parent computed token",
    kind: "string",
  },
  {
    id: "callerRegisteredInitialToken",
    label: "Caller registered initial token",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.keyword !== "initial" && input.keyword !== "inherit")
    simpleError(
      "keyword",
      "Supported inherit/initial custom property resolution only.",
    );
  return {
    resolvedCustomPropertyToken:
      input.keyword === "inherit"
        ? input.callerParentComputedToken
        : input.isRegistered
          ? input.callerRegisteredInitialToken
          : "",
    guaranteedInvalid: input.keyword === "initial" && !input.isRegistered,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  keyword: "initial",
  isRegistered: false,
  callerParentComputedToken: "red",
  callerRegisteredInitialToken: "blue",
} satisfies Input;
export const exampleOutput = {
  resolvedCustomPropertyToken: "",
  guaranteedInvalid: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/custom-property-inherit-vs-initial",
  title: "Custom Property inherit vs initial",
  description:
    "Custom-property initial is guaranteed-invalid unless registered with supplied initial token; inherit uses parent independently computed value, not ordinary property default. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedCustomPropertyToken",
      label: "Resolved custom property token",
      kind: "string",
    },
    { id: "guaranteedInvalid", label: "Guaranteed invalid", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      keyword: value.keyword as string,
      isRegistered: value.isRegistered as boolean,
      callerParentComputedToken: value.callerParentComputedToken as string,
      callerRegisteredInitialToken:
        value.callerRegisteredInitialToken as string,
    }),
});
export const run = tool.execute;
export default tool;

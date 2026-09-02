import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPresentParameterIds: readonly string[];
  readonly callerKnownParameterFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingRequiredParameterIds: readonly string[];
  readonly allDeclaredRequiredParametersKnown: boolean;
}>;
const inputFields = [
  {
    id: "callerPresentParameterIds",
    label: "Caller present parameter ids",
    kind: "stringList",
  },
  {
    id: "callerKnownParameterFlags",
    label: "Caller known parameter flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerKnownParameterFlags, "callerKnownParameterFlags");
  aligned(
    input.callerPresentParameterIds,
    input.callerKnownParameterFlags,
    "callerPresentParameterIds",
  );
  unique(input.callerPresentParameterIds, "parameters");
  const required = [
    "ra",
    "dec",
    "parallax",
    "raStarProperMotion",
    "decProperMotion",
  ];
  const missing = required.filter((v) => {
    const i = input.callerPresentParameterIds.indexOf(v);
    return i < 0 || !input.callerKnownParameterFlags[i];
  });
  return {
    missingRequiredParameterIds: missing,
    allDeclaredRequiredParametersKnown: missing.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPresentParameterIds: [
    "ra",
    "dec",
    "parallax",
    "raStarProperMotion",
    "decProperMotion",
  ],
  callerKnownParameterFlags: [1, 1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  missingRequiredParameterIds: [],
  allDeclaredRequiredParametersKnown: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/gaia-fiveparam-completeness-checker",
  title: "Gaia DR3 Five-Parameter Solution Completeness Checker",
  description:
    "Dec lared Gaia-style five-parameter completeness audit with independent presence/known flags; no numerical fit rank, catalog authenticity or valid solution status. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingRequiredParameterIds",
      label: "Missing required parameter ids",
      kind: "stringList",
    },
    {
      id: "allDeclaredRequiredParametersKnown",
      label: "All declared required parameters known",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPresentParameterIds:
        value.callerPresentParameterIds as readonly string[],
      callerKnownParameterFlags:
        value.callerKnownParameterFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly reciprocalDilutions: readonly number[];
  readonly agglutinationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly endpointReciprocal: number;
  readonly endpointDetected: boolean;
  readonly rightCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.reciprocalDilutions,
    input.agglutinationFlags,
    "reciprocalDilutions",
  );
  ordered(input.reciprocalDilutions, "reciprocalDilutions");
  input.reciprocalDilutions.forEach((v) => positive(v, "reciprocalDilutions"));
  if (
    input.agglutinationFlags.some(
      (v, i) =>
        (v !== 0 && v !== 1) || (i > 0 && v > input.agglutinationFlags[i - 1]),
    )
  )
    simpleError(
      "agglutinationFlags",
      "Binary nonincreasing agglutination observations required.",
    );
  let index = -1;
  input.agglutinationFlags.forEach((v, i) => {
    if (v === 1) index = i;
  });
  return {
    endpointReciprocal: index < 0 ? 0 : input.reciprocalDilutions[index],
    endpointDetected: index >= 0,
    rightCensored: index === input.reciprocalDilutions.length - 1,
  };
};
export const exampleInput = {
  reciprocalDilutions: [2, 4, 8, 16],
  agglutinationFlags: [1, 1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  endpointReciprocal: 4,
  endpointDetected: true,
  rightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/hemagglutination-dilution-endpoint",
  title: "Hemagglutination Dilution Endpoint",
  description:
    "Find an observed HA reciprocal-dilution endpoint with monotonicity and censoring checks.",
  inputs: [
    {
      id: "reciprocalDilutions",
      label: "Reciprocal dilutions",
      kind: "numberList",
    },
    {
      id: "agglutinationFlags",
      label: "Agglutination flags",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "endpointReciprocal", label: "Endpoint reciprocal", kind: "number" },
    { id: "endpointDetected", label: "Endpoint detected", kind: "boolean" },
    { id: "rightCensored", label: "Right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      reciprocalDilutions: value.reciprocalDilutions as readonly number[],
      agglutinationFlags: value.agglutinationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

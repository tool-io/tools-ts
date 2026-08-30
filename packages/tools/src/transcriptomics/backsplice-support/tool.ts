import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly donorCoordinates: readonly number[];
  readonly acceptorCoordinates: readonly number[];
  readonly minimumSupport: number;
}>;
export type Output = Readonly<{
  readonly backspliceIndexes: readonly number[];
  readonly supportCount: number;
  readonly supported: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.donorCoordinates.length === 0 ||
    input.donorCoordinates.length !== input.acceptorCoordinates.length ||
    input.minimumSupport < 1
  )
    simpleError(
      "donorCoordinates",
      "Aligned junction coordinates are required.",
    );
  const backspliceIndexes = input.donorCoordinates.flatMap((v, i) =>
    v > input.acceptorCoordinates[i] ? [i] : [],
  );
  return {
    backspliceIndexes,
    supportCount: backspliceIndexes.length,
    supported: backspliceIndexes.length >= input.minimumSupport,
  };
};

export const exampleInput = {
  donorCoordinates: [200, 100, 200],
  acceptorCoordinates: [100, 200, 100],
  minimumSupport: 2,
} satisfies Input;
export const exampleOutput = {
  backspliceIndexes: [0, 2],
  supportCount: 2,
  supported: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/backsplice-support",
  title: "Backsplice Support",
  description: "Tally back-splice junction reads supporting a circular RNA.",
  inputs: [
    { id: "donorCoordinates", kind: "numberList", label: "Donor coordinates" },
    {
      id: "acceptorCoordinates",
      kind: "numberList",
      label: "Acceptor coordinates",
    },
    { id: "minimumSupport", kind: "number", label: "Minimum support" },
  ],
  outputs: [
    {
      id: "backspliceIndexes",
      kind: "numberList",
      label: "Backsplice indexes",
    },
    { id: "supportCount", kind: "number", label: "Support count" },
    { id: "supported", kind: "boolean", label: "Supported" },
  ],
  calculate: (value) =>
    calculate({
      donorCoordinates: value.donorCoordinates as readonly number[],
      acceptorCoordinates: value.acceptorCoordinates as readonly number[],
      minimumSupport: value.minimumSupport as number,
    }),
});
export const run = tool.execute;
export default tool;

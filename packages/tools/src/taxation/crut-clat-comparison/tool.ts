import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly contributionValue: number;
  readonly crutRemainderFactor: number;
  readonly clatLeadFactor: number;
}>;
export type Output = Readonly<{
  readonly crutCharitableValue: number;
  readonly clatCharitableValue: number;
  readonly charitableValueDifference: number;
  readonly higherCharitableValue: string;
}>;

export const calculate = (input: Input): Output => {
  const crutCharitableValue =
    input.contributionValue * input.crutRemainderFactor;
  const clatCharitableValue = input.contributionValue * input.clatLeadFactor;
  return {
    crutCharitableValue,
    clatCharitableValue,
    charitableValueDifference: crutCharitableValue - clatCharitableValue,
    higherCharitableValue:
      crutCharitableValue === clatCharitableValue
        ? "tie"
        : crutCharitableValue > clatCharitableValue
          ? "crut"
          : "clat",
  };
};

export const exampleInput = {
  contributionValue: 1000,
  crutRemainderFactor: 0.4,
  clatLeadFactor: 0.3,
} satisfies Input;
export const exampleOutput = {
  crutCharitableValue: 400,
  clatCharitableValue: 300,
  charitableValueDifference: 100,
  higherCharitableValue: "crut",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      contributionValue: input.contributionValue as number,
      crutRemainderFactor: input.crutRemainderFactor as number,
      clatLeadFactor: input.clatLeadFactor as number,
    }),
  description:
    "Compare caller-supplied CRUT remainder and CLAT lead valuation factors.",
  id: "taxation/crut-clat-comparison",
  inputs: [
    {
      id: "contributionValue",
      label: "Trust contribution value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "crutRemainderFactor",
      label: "CRUT remainder factor",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "clatLeadFactor",
      label: "CLAT lead factor",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "crutCharitableValue",
      label: "CRUT charitable remainder value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "clatCharitableValue",
      label: "CLAT charitable lead value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "charitableValueDifference",
      label: "CRUT minus CLAT charitable value",
      kind: "number",
    },
    {
      id: "higherCharitableValue",
      label: "Higher modeled charitable value",
      kind: "string",
      enum: ["crut", "clat", "tie"],
    },
  ],
  title: "CRUT–CLAT Comparison",
});

export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly freeFromControl: boolean;
  readonly outsideUsualBusiness: boolean;
  readonly independentTrade: boolean;
}>;
export type Output = Readonly<{
  readonly satisfiedProngs: number;
  readonly failedProngs: readonly string[];
  readonly screenResult: string;
}>;

export const calculate = (input: Input): Output => {
  const entries = [
    ["A", input.freeFromControl],
    ["B", input.outsideUsualBusiness],
    ["C", input.independentTrade],
  ] as const;
  const failedProngs = entries.filter(([, ok]) => !ok).map(([id]) => id);
  return {
    satisfiedProngs: 3 - failedProngs.length,
    failedProngs,
    screenResult:
      failedProngs.length === 0 ? "passes-all-prongs" : "fails-one-or-more",
  };
};

export const exampleInput = {
  freeFromControl: true,
  outsideUsualBusiness: false,
  independentTrade: true,
} satisfies Input;
export const exampleOutput = {
  satisfiedProngs: 2,
  failedProngs: ["B"],
  screenResult: "fails-one-or-more",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      freeFromControl: input.freeFromControl as boolean,
      outsideUsualBusiness: input.outsideUsualBusiness as boolean,
      independentTrade: input.independentTrade as boolean,
    }),
  description:
    "Evaluate supplied worker facts against the three ABC-test prongs.",
  id: "journalism/abc-worker-screen",
  inputs: [
    {
      id: "freeFromControl",
      label: "Worker is free from control",
      kind: "boolean",
    },
    {
      id: "outsideUsualBusiness",
      label: "Work is outside usual business",
      kind: "boolean",
    },
    {
      id: "independentTrade",
      label: "Worker has independent trade",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "satisfiedProngs",
      label: "Satisfied ABC prongs",
      kind: "integer",
      minimum: 0,
      maximum: 3,
    },
    { id: "failedProngs", label: "Failed ABC prongs", kind: "stringList" },
    {
      id: "screenResult",
      label: "ABC screen result",
      kind: "string",
      enum: ["passes-all-prongs", "fails-one-or-more"],
    },
  ],
  title: "ABC Worker Screen",
});

export const run = tool.execute;
export default tool;

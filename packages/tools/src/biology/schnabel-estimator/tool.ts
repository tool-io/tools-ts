import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchnabelInput = {
  readonly caughtSessionOne: number;
  readonly caughtSessionTwo: number;
  readonly recapturesTotal: number;
};

export type SchnabelOutput = {
  readonly schnabelEstimate: number;
};

export const schnabelExample = {
  input: { caughtSessionOne: 62, caughtSessionTwo: 37, recapturesTotal: 11 },
  output: { schnabelEstimate: 208.54545454545453 },
} satisfies ToolExample<SchnabelInput, SchnabelOutput>;

export const schnabelTool = createSimpleTool({
  id: "biology/schnabel-estimator",
  title: "Schnabel Estimate",
  description:
    "Estimate population size from a documented two sample Schnabel census.",
  inputs: [
    {
      id: "caughtSessionOne",
      kind: "integer",
      label: "Caught in session one",
      minimum: 1,
      unit: "individuals",
    },
    {
      id: "caughtSessionTwo",
      kind: "integer",
      label: "Caught in session two",
      minimum: 1,
      unit: "individuals",
    },
    {
      id: "recapturesTotal",
      kind: "integer",
      label: "Recaptures total",
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "schnabelEstimate",
      kind: "number",
      label: "Schnabel estimate",
      unit: "individuals",
    },
  ],
  calculate: (input) => {
    const recapturesTotal = input.recapturesTotal as number;
    if (recapturesTotal < 1)
      simpleError(
        "recapturesTotal",
        "At least one individual must be recaptured.",
        "zero_recaptures",
      );
    return {
      schnabelEstimate:
        ((input.caughtSessionOne as number) *
          (input.caughtSessionTwo as number)) /
        recapturesTotal,
    };
  },
});
export const runSchnabel = schnabelTool.execute;
export default schnabelTool;

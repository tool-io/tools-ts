import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const chao1BiasCorrectedExample = {
  input: { doubletonInt: 3, observedInt: 10, singletonInt: 5 },
  output: { biasCorrectedChao1: 12.5 },
} satisfies ToolExample<
  {
    readonly doubletonInt: number;
    readonly observedInt: number;
    readonly singletonInt: number;
  },
  { readonly biasCorrectedChao1: number }
>;

export const chao1BiasCorrectedTool = createSimpleTool({
  id: "biology/expected-species-chao1-bias-corrected",
  title: "Chao1 Bias Corrected",
  description:
    "Compute the documented bias-corrected Chao1 estimate as observed species plus singletons times singletons minus one divided by two times doubletons plus one.",
  inputs: [
    {
      id: "observedInt",
      label: "Observed species",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "singletonInt",
      label: "Singletons",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "doubletonInt",
      label: "Doubletons",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "biasCorrectedChao1",
      label: "Bias-corrected Chao1 estimate",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const observedInt = input.observedInt as number;
    const singletonInt = input.singletonInt as number;
    const doubletonInt = input.doubletonInt as number;
    if (singletonInt + doubletonInt > observedInt)
      simpleError(
        "singletonInt",
        "Singleton and doubleton species must not exceed observed species.",
        "invalid_counts",
      );
    return {
      biasCorrectedChao1:
        observedInt +
        (singletonInt * (singletonInt - 1)) / (2 * (doubletonInt + 1)),
    };
  },
});
export const runChao1BiasCorrected = chao1BiasCorrectedTool.execute;
export default chao1BiasCorrectedTool;

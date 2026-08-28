import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OutputCapacitorEsrLimitInput = {
  readonly allowedOutputRippleMv: number;
  readonly rippleCurrentA: number;
};

export type OutputCapacitorEsrLimitOutput = {
  readonly esrLimitMilliohms: number;
};

export const outputCapacitorEsrLimitExample = {
  input: { allowedOutputRippleMv: 50, rippleCurrentA: 2 },
  output: { esrLimitMilliohms: 25 },
} satisfies ToolExample<
  OutputCapacitorEsrLimitInput,
  OutputCapacitorEsrLimitOutput
>;

export const calculateOutputCapacitorEsrLimit = (
  input: OutputCapacitorEsrLimitInput,
): OutputCapacitorEsrLimitOutput => {
  if (!(input.allowedOutputRippleMv > 0))
    simpleError(
      "allowedOutputRippleMv",
      "Allowed ripple must be positive.",
      "invalid_ripple",
    );
  if (!(input.rippleCurrentA > 0))
    simpleError(
      "rippleCurrentA",
      "Ripple current must be positive.",
      "invalid_current",
    );
  return {
    esrLimitMilliohms: input.allowedOutputRippleMv / input.rippleCurrentA,
  };
};

export const outputCapacitorEsrLimitTool = createSimpleTool({
  calculate: (input) =>
    calculateOutputCapacitorEsrLimit(
      input as unknown as OutputCapacitorEsrLimitInput,
    ),
  description:
    "Compute the maximum output capacitor ESR in milliohms that keeps ripple-induced ripple voltage within budget as ripple millivolts over ripple amperes.",
  id: "electronics/output-capacitor-esr-limit",
  inputs: [
    {
      id: "allowedOutputRippleMv",
      kind: "number",
      label: "Allowed output ripple",
      unit: "mV",
    },
    {
      id: "rippleCurrentA",
      kind: "number",
      label: "Ripple current",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "esrLimitMilliohms",
      kind: "number",
      label: "ESR limit",
      unit: "mΩ",
    },
  ],
  title: "ESR Limit For Ripple",
});
export const runOutputCapacitorEsrLimit = outputCapacitorEsrLimitTool.execute;
export default outputCapacitorEsrLimitTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAlignedEffectAlleleDosages: readonly number[];
  readonly callerExternallyValidatedVariantWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAlignedEffectAlleleDosages",
    label: "Actual aligned effect allele do sages",
    kind: "numberList",
  },
  {
    id: "callerExternallyValidatedVariantWeights",
    label: "Caller externally validated variant weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualAlignedEffectAlleleDosages.length)
    simpleError(
      "actualAlignedEffectAlleleDosages",
      "Actual nonempty observations.",
    );
  input.actualAlignedEffectAlleleDosages.forEach((v) =>
    nonnegative(v, "actualAlignedEffectAlleleDosages"),
  );
  if (!input.callerExternallyValidatedVariantWeights.length)
    simpleError(
      "callerExternallyValidatedVariantWeights",
      "Actual nonempty observations.",
    );
  aligned(
    input.actualAlignedEffectAlleleDosages,
    input.callerExternallyValidatedVariantWeights,
    "variants",
  );
  if (input.actualAlignedEffectAlleleDosages.some((v) => v < 0 || v > 2))
    simpleError("dosages", "Actual0–2effectalleledosages.");
  return {
    value: sum(
      input.actualAlignedEffectAlleleDosages.map(
        (v, i) => v * input.callerExternallyValidatedVariantWeights[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAlignedEffectAlleleDosages: [1, 2],
    callerExternallyValidatedVariantWeights: [0.1, 0.2],
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/polygenic-risk-score",
  title: "Polygenic Risk Score Calculator",
  description:
    "Simple additive actual aligned allele dosage\u00d7external variant weights PRSsum, not absolute individual risk, ancestry portable predictor or variant weight estimation. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

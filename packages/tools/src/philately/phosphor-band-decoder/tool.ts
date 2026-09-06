import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly stampWidthMm: number;
  readonly observedBandLeftEdgesMm: readonly number[];
  readonly observedBandRightEdgesMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly bandCount: number;
  readonly bandCenterFractions: readonly number[];
  readonly bandWidthFractions: readonly number[];
}>;
const inputFields = [
  { id: "stampWidthMm", label: "Stamp width mm", kind: "number" },
  {
    id: "observedBandLeftEdgesMm",
    label: "Observed band left edges mm",
    kind: "numberList",
  },
  {
    id: "observedBandRightEdgesMm",
    label: "Observed band right edges mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stampWidthMm, "stampWidthMm");
  input.observedBandLeftEdgesMm.forEach((v) =>
    nonnegative(v, "observedBandLeftEdgesMm"),
  );
  aligned(
    input.observedBandLeftEdgesMm,
    input.observedBandRightEdgesMm,
    "observedBandLeftEdgesMm",
  );
  input.observedBandLeftEdgesMm.forEach((v, i) => {
    if (
      input.observedBandRightEdgesMm[i] <= v ||
      input.observedBandRightEdgesMm[i] > input.stampWidthMm ||
      (i > 0 && v < input.observedBandRightEdgesMm[i - 1])
    )
      simpleError(
        "bands",
        "Sorted nonoverlapping positive-width observed bands within stamp.",
      );
  });
  return {
    bandCount: input.observedBandLeftEdgesMm.length,
    bandCenterFractions: input.observedBandLeftEdgesMm.map(
      (v, i) =>
        (v + input.observedBandRightEdgesMm[i]) / 2 / input.stampWidthMm,
    ),
    bandWidthFractions: input.observedBandLeftEdgesMm.map(
      (v, i) => (input.observedBandRightEdgesMm[i] - v) / input.stampWidthMm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stampWidthMm: 20,
  observedBandLeftEdgesMm: [1, 14],
  observedBandRightEdgesMm: [3, 16],
} satisfies Input;
export const exampleOutput = {
  bandCount: 2,
  bandCenterFractions: [0.1, 0.75],
  bandWidthFractions: [0.1, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/phosphor-band-decoder",
  title: "Phosphor Band Count and Position Decoder",
  description:
    "Decode independently observed phosphor band extents into count and normalized positions; no UV exposure advice. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "bandCount", label: "Band count", kind: "number" },
    {
      id: "bandCenterFractions",
      label: "Band center fractions",
      kind: "numberList",
    },
    {
      id: "bandWidthFractions",
      label: "Band width fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      stampWidthMm: value.stampWidthMm as number,
      observedBandLeftEdgesMm:
        value.observedBandLeftEdgesMm as readonly number[],
      observedBandRightEdgesMm:
        value.observedBandRightEdgesMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

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
  aligned,
  unique,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly wavelengthNm: number;
  readonly callerBandNames: readonly string[];
  readonly callerBandLowerNm: readonly number[];
  readonly callerBandUpperNm: readonly number[];
}>;
export type Output = Readonly<{
  readonly matchingCallerBandNames: readonly string[];
}>;
const inputFields = [
  { id: "wavelengthNm", label: "Wavelength nm", kind: "number" },
  { id: "callerBandNames", label: "Caller band names", kind: "stringList" },
  {
    id: "callerBandLowerNm",
    label: "Caller band lower nm",
    kind: "numberList",
  },
  {
    id: "callerBandUpperNm",
    label: "Caller band upper nm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wavelengthNm, "wavelengthNm");
  input.callerBandLowerNm.forEach((v) => positive(v, "callerBandLowerNm"));
  input.callerBandUpperNm.forEach((v) => positive(v, "callerBandUpperNm"));
  aligned(input.callerBandNames, input.callerBandLowerNm, "callerBandNames");
  aligned(input.callerBandNames, input.callerBandUpperNm, "callerBandNames");
  unique(input.callerBandNames, "bands");
  input.callerBandLowerNm.forEach((v, i) => {
    if (v >= input.callerBandUpperNm[i])
      simpleError(
        "band",
        "Positive independently documented half-open ranges.",
      );
  });
  return {
    matchingCallerBandNames: input.callerBandNames.filter(
      (_, i) =>
        input.wavelengthNm >= input.callerBandLowerNm[i] &&
        input.wavelengthNm < input.callerBandUpperNm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wavelengthNm: 500,
  callerBandNames: ["short", "long"],
  callerBandLowerNm: [400, 500],
  callerBandUpperNm: [500, 600],
} satisfies Input;
export const exampleOutput = {
  matchingCallerBandNames: ["long"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/spectral-band-name-from-nm-lookup",
  title: "Spectral Band Name From nm Lookup",
  description:
    "Exact caller independently documented spectral named bands with lower-inclusive/upper-exclusive boundaries and overlaps retained; visible color names not universal wavelength identity. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerBandNames",
      label: "Matching caller band names",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      wavelengthNm: value.wavelengthNm as number,
      callerBandNames: value.callerBandNames as readonly string[],
      callerBandLowerNm: value.callerBandLowerNm as readonly number[],
      callerBandUpperNm: value.callerBandUpperNm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

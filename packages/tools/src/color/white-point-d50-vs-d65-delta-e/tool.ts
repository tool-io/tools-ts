import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, vector3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredD50WhiteLabInCommonReference: readonly number[];
  readonly independentlyMeasuredD65WhiteLabInCommonReference: readonly number[];
}>;
export type Output = Readonly<{
  readonly commonReferenceWhiteDeltaECie76: number;
}>;
const inputFields = [
  {
    id: "independentlyMeasuredD50WhiteLabInCommonReference",
    label: "Independently measured d50 white lab in common reference",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredD65WhiteLabInCommonReference",
    label: "Independently measured d65 white lab in common reference",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  vector3(input.independentlyMeasuredD50WhiteLabInCommonReference, "D50");
  vector3(input.independentlyMeasuredD65WhiteLabInCommonReference, "D65");
  return {
    commonReferenceWhiteDeltaECie76: Math.hypot(
      ...input.independentlyMeasuredD50WhiteLabInCommonReference.map(
        (v, i) =>
          v - input.independentlyMeasuredD65WhiteLabInCommonReference[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyMeasuredD50WhiteLabInCommonReference: [100, 2, 3],
  independentlyMeasuredD65WhiteLabInCommonReference: [100, 0, 0],
} satisfies Input;
export const exampleOutput = {
  commonReferenceWhiteDeltaECie76: 3.605551275463989,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/white-point-d50-vs-d65-delta-e",
  title: "D50 vs D65 White Point Delta E",
  description:
    "Actual independently measured D50/D65 white responses in ONE common CIELAB reference; own-white normalized Lab values both 100,0,0 are not a physical illuminant difference. No invented XYZ adaptation. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "commonReferenceWhiteDeltaECie76",
      label: "Common reference white delta e cie76",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyMeasuredD50WhiteLabInCommonReference:
        value.independentlyMeasuredD50WhiteLabInCommonReference as readonly number[],
      independentlyMeasuredD65WhiteLabInCommonReference:
        value.independentlyMeasuredD65WhiteLabInCommonReference as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

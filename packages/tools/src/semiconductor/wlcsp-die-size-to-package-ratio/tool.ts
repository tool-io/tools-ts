import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDieWidthMm: number;
  readonly observedDieHeightMm: number;
  readonly observedWlcspPackageWidthMm: number;
  readonly observedWlcspPackageHeightMm: number;
}>;
export type Output = Readonly<{
  readonly dieAreaFractionOfPackage: number;
  readonly totalPackageOverhangAreaMm2: number;
}>;
const inputFields = [
  { id: "observedDieWidthMm", label: "Observed die width mm", kind: "number" },
  {
    id: "observedDieHeightMm",
    label: "Observed die height mm",
    kind: "number",
  },
  {
    id: "observedWlcspPackageWidthMm",
    label: "Observed wlcsp package width mm",
    kind: "number",
  },
  {
    id: "observedWlcspPackageHeightMm",
    label: "Observed wlcsp package height mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDieWidthMm, "observedDieWidthMm");
  positive(input.observedDieHeightMm, "observedDieHeightMm");
  positive(input.observedWlcspPackageWidthMm, "observedWlcspPackageWidthMm");
  positive(input.observedWlcspPackageHeightMm, "observedWlcspPackageHeightMm");
  if (
    input.observedDieWidthMm > input.observedWlcspPackageWidthMm ||
    input.observedDieHeightMm > input.observedWlcspPackageHeightMm
  )
    simpleError(
      "package",
      "Explicit aligned rectangular package enclosing die required.",
    );
  const die = input.observedDieWidthMm * input.observedDieHeightMm,
    pack =
      input.observedWlcspPackageWidthMm * input.observedWlcspPackageHeightMm;
  return {
    dieAreaFractionOfPackage: die / pack,
    totalPackageOverhangAreaMm2: pack - die,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDieWidthMm: 2,
  observedDieHeightMm: 3,
  observedWlcspPackageWidthMm: 2.2,
  observedWlcspPackageHeightMm: 3.2,
} satisfies Input;
export const exampleOutput = {
  dieAreaFractionOfPackage: 0.8522727272727273,
  totalPackageOverhangAreaMm2: 1.04,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/wlcsp-die-size-to-package-ratio",
  title: "Semiconductor Wlcsp Die Size To Package Ratio Calculator",
  description:
    "Audit measured aligned WLCSP rectangular die/package area efficiency and overhang, no edge seal, bump layout or manufacturability guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "dieAreaFractionOfPackage",
      label: "Die area fraction of package",
      kind: "number",
    },
    {
      id: "totalPackageOverhangAreaMm2",
      label: "Total package overhang area mm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDieWidthMm: value.observedDieWidthMm as number,
      observedDieHeightMm: value.observedDieHeightMm as number,
      observedWlcspPackageWidthMm: value.observedWlcspPackageWidthMm as number,
      observedWlcspPackageHeightMm:
        value.observedWlcspPackageHeightMm as number,
    }),
});
export const run = tool.execute;
export default tool;

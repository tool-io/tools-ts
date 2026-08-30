import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly requiredShelfRunM: number;
  readonly fixedShelfFootprintM2: number;
  readonly compactShelfFootprintM2: number;
  readonly fixedAccessAisleM2: number;
  readonly compactAccessAisleM2: number;
}>;
export type Output = Readonly<{
  readonly fixedTotalFloorAreaM2: number;
  readonly compactTotalFloorAreaM2: number;
  readonly signedEquivalentCapacityAreaSavingPercent: number;
  readonly fixedShelfRunPerTotalM2: number;
  readonly compactShelfRunPerTotalM2: number;
}>;
const inputFields = [
  { id: "requiredShelfRunM", label: "Required shelf run m", kind: "number" },
  {
    id: "fixedShelfFootprintM2",
    label: "Fixed shelf footprint m2",
    kind: "number",
  },
  {
    id: "compactShelfFootprintM2",
    label: "Compact shelf footprint m2",
    kind: "number",
  },
  { id: "fixedAccessAisleM2", label: "Fixed access aisle m2", kind: "number" },
  {
    id: "compactAccessAisleM2",
    label: "Compact access aisle m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.requiredShelfRunM, "requiredShelfRunM");
  positive(input.fixedShelfFootprintM2, "fixedShelfFootprintM2");
  positive(input.compactShelfFootprintM2, "compactShelfFootprintM2");
  nonnegative(input.fixedAccessAisleM2, "fixedAccessAisleM2");
  nonnegative(input.compactAccessAisleM2, "compactAccessAisleM2");
  const a = input.fixedShelfFootprintM2 + input.fixedAccessAisleM2,
    b = input.compactShelfFootprintM2 + input.compactAccessAisleM2;
  return {
    fixedTotalFloorAreaM2: a,
    compactTotalFloorAreaM2: b,
    signedEquivalentCapacityAreaSavingPercent: (100 * (a - b)) / a,
    fixedShelfRunPerTotalM2: input.requiredShelfRunM / a,
    compactShelfRunPerTotalM2: input.requiredShelfRunM / b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredShelfRunM: 100,
  fixedShelfFootprintM2: 100,
  compactShelfFootprintM2: 50,
  fixedAccessAisleM2: 20,
  compactAccessAisleM2: 30,
} satisfies Input;
export const exampleOutput = {
  fixedTotalFloorAreaM2: 120,
  compactTotalFloorAreaM2: 80,
  signedEquivalentCapacityAreaSavingPercent: 33.333333333333336,
  fixedShelfRunPerTotalM2: 0.8333333333333334,
  compactShelfRunPerTotalM2: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/compact-shelving-space-saving-percent",
  title: "Compact Shelving Space Saving Percent Calculator",
  description:
    "Compare equal caller storage-run capacity including independently declared access aisles, retaining signed compact-layout saving; no engineering floor loading, emergency access or safe layout approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "fixedTotalFloorAreaM2",
      label: "Fixed total floor area m2",
      kind: "number",
    },
    {
      id: "compactTotalFloorAreaM2",
      label: "Compact total floor area m2",
      kind: "number",
    },
    {
      id: "signedEquivalentCapacityAreaSavingPercent",
      label: "Signed equivalent capacity area saving percent",
      kind: "number",
    },
    {
      id: "fixedShelfRunPerTotalM2",
      label: "Fixed shelf run per total m2",
      kind: "number",
    },
    {
      id: "compactShelfRunPerTotalM2",
      label: "Compact shelf run per total m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredShelfRunM: value.requiredShelfRunM as number,
      fixedShelfFootprintM2: value.fixedShelfFootprintM2 as number,
      compactShelfFootprintM2: value.compactShelfFootprintM2 as number,
      fixedAccessAisleM2: value.fixedAccessAisleM2 as number,
      compactAccessAisleM2: value.compactAccessAisleM2 as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly workingEquipmentWidthM: number;
  readonly travelLaneWidthM: number;
  readonly standOffM: number;
  readonly rockfallAllowanceM: number;
}>;
export type Output = Readonly<{ readonly requiredWorkingBenchWidthM: number }>;
const inputFields = [
  {
    id: "workingEquipmentWidthM",
    label: "Working equipment width m",
    kind: "number",
  },
  { id: "travelLaneWidthM", label: "Travel lane width m", kind: "number" },
  { id: "standOffM", label: "Stand off m", kind: "number" },
  { id: "rockfallAllowanceM", label: "Rockfall allowance m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.workingEquipmentWidthM, "workingEquipmentWidthM");
  positive(input.travelLaneWidthM, "travelLaneWidthM");
  nonnegative(input.standOffM, "standOffM");
  nonnegative(input.rockfallAllowanceM, "rockfallAllowanceM");
  return {
    requiredWorkingBenchWidthM:
      input.workingEquipmentWidthM +
      input.travelLaneWidthM +
      input.standOffM +
      input.rockfallAllowanceM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  workingEquipmentWidthM: 8,
  travelLaneWidthM: 6,
  standOffM: 2,
  rockfallAllowanceM: 3,
} satisfies Input;
export const exampleOutput = {
  requiredWorkingBenchWidthM: 19,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bench-width",
  title: "Bench Width",
  description:
    "Assemble nonoverlapping caller working-bench equipment, lane, stand-off and rockfall allocations; not a traffic or geotechnical safety standard.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWorkingBenchWidthM",
      label: "Required working bench width m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      workingEquipmentWidthM: value.workingEquipmentWidthM as number,
      travelLaneWidthM: value.travelLaneWidthM as number,
      standOffM: value.standOffM as number,
      rockfallAllowanceM: value.rockfallAllowanceM as number,
    }),
});
export const run = tool.execute;
export default tool;

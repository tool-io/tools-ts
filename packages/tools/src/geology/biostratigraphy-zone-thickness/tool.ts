import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly zoneBaseBoundsM: readonly number[];
  readonly zoneTopBoundsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumZoneThicknessM: number;
  readonly maximumZoneThicknessM: number;
}>;
const inputFields = [
  { id: "zoneBaseBoundsM", label: "Zone base bounds m", kind: "numberList" },
  { id: "zoneTopBoundsM", label: "Zone top bounds m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.zoneBaseBoundsM.length !== 2 || input.zoneTopBoundsM.length !== 2)
    simpleError(
      "bounds",
      "Two ordered lower/upper observed depositional coordinates per datum.",
    );
  ordered(input.zoneBaseBoundsM[0], input.zoneBaseBoundsM[1]);
  ordered(input.zoneTopBoundsM[0], input.zoneTopBoundsM[1]);
  const lo = nonnegative(
    input.zoneTopBoundsM[0] - input.zoneBaseBoundsM[1],
    "nonoverlapping zone",
  );
  return {
    minimumZoneThicknessM: lo,
    maximumZoneThicknessM: input.zoneTopBoundsM[1] - input.zoneBaseBoundsM[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zoneBaseBoundsM: [1, 2],
  zoneTopBoundsM: [5, 7],
} satisfies Input;
export const exampleOutput = {
  minimumZoneThicknessM: 3,
  maximumZoneThicknessM: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/biostratigraphy-zone-thickness",
  title: "Geology Biostratigraphy Zone Thickness Calculator",
  description:
    "Zone thickness interval from independently observed boundary uncertainty brackets; no exact thickness collapsed from uncertain FAD/LAD. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumZoneThicknessM",
      label: "Minimum zone thickness m",
      kind: "number",
    },
    {
      id: "maximumZoneThicknessM",
      label: "Maximum zone thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zoneBaseBoundsM: value.zoneBaseBoundsM as readonly number[],
      zoneTopBoundsM: value.zoneTopBoundsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

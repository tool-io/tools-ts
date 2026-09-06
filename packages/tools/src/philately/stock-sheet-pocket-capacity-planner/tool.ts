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
  sum,
  slotCapacity,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly usablePocketWidthsMm: readonly number[];
  readonly usablePocketHeightMm: number;
  readonly stampWidthMm: number;
  readonly stampHeightMm: number;
  readonly horizontalGapMm: number;
}>;
export type Output = Readonly<{
  readonly pocketCapacities: readonly number[];
  readonly totalCapacity: number;
}>;
const inputFields = [
  {
    id: "usablePocketWidthsMm",
    label: "Usable pocket widths mm",
    kind: "numberList",
  },
  {
    id: "usablePocketHeightMm",
    label: "Usable pocket height mm",
    kind: "number",
  },
  { id: "stampWidthMm", label: "Stamp width mm", kind: "number" },
  { id: "stampHeightMm", label: "Stamp height mm", kind: "number" },
  { id: "horizontalGapMm", label: "Horizontal gap mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.usablePocketHeightMm, "usablePocketHeightMm");
  positive(input.stampWidthMm, "stampWidthMm");
  positive(input.stampHeightMm, "stampHeightMm");
  input.usablePocketWidthsMm.forEach((v) =>
    nonnegative(v, "usablePocketWidthsMm"),
  );
  nonnegative(input.horizontalGapMm, "horizontalGapMm");
  if (input.stampHeightMm > input.usablePocketHeightMm)
    simpleError("height", "Stamp does not fit declared usable pocket height.");
  const caps = input.usablePocketWidthsMm.map((v) =>
    slotCapacity(v, input.stampWidthMm, input.horizontalGapMm),
  );
  return { pocketCapacities: caps, totalCapacity: sum(caps) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usablePocketWidthsMm: [100, 80],
  usablePocketHeightMm: 40,
  stampWidthMm: 20,
  stampHeightMm: 30,
  horizontalGapMm: 2,
} satisfies Input;
export const exampleOutput = {
  pocketCapacities: [4, 3],
  totalCapacity: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/stock-sheet-pocket-capacity-planner",
  title: "Stock Sheet Pocket Count Capacity Planner",
  description:
    "Count unrotated single-row slots per actual usable stock-sheet pocket, retaining per-pocket constraints. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "pocketCapacities", label: "Pocket capacities", kind: "numberList" },
    { id: "totalCapacity", label: "Total capacity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      usablePocketWidthsMm: value.usablePocketWidthsMm as readonly number[],
      usablePocketHeightMm: value.usablePocketHeightMm as number,
      stampWidthMm: value.stampWidthMm as number,
      stampHeightMm: value.stampHeightMm as number,
      horizontalGapMm: value.horizontalGapMm as number,
    }),
});
export const run = tool.execute;
export default tool;

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
  bounded,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredExteriorBaseSegmentsM: readonly number[];
  readonly observedDoorOpeningWidthsM: readonly number[];
  readonly callerCornerSpliceAllowancesM: readonly number[];
  readonly usableStockBoardLengthM: number;
}>;
export type Output = Readonly<{
  readonly netContinuousBaseboardLengthM: number;
  readonly minimumLengthBudgetWholeBoards: number;
  readonly totalLengthBudgetOffcutM: number;
}>;
const inputFields = [
  {
    id: "measuredExteriorBaseSegmentsM",
    label: "Measured exterior base segments m",
    kind: "numberList",
  },
  {
    id: "observedDoorOpeningWidthsM",
    label: "Observed door opening widths m",
    kind: "numberList",
  },
  {
    id: "callerCornerSpliceAllowancesM",
    label: "Caller corner splice allowances m",
    kind: "numberList",
  },
  {
    id: "usableStockBoardLengthM",
    label: "Usable stock board length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredExteriorBaseSegmentsM.forEach((v) =>
    positive(v, "measuredExteriorBaseSegmentsM"),
  );
  positive(input.usableStockBoardLengthM, "usableStockBoardLengthM");
  input.observedDoorOpeningWidthsM.forEach((v) =>
    nonnegative(v, "observedDoorOpeningWidthsM"),
  );
  input.callerCornerSpliceAllowancesM.forEach((v) =>
    nonnegative(v, "callerCornerSpliceAllowancesM"),
  );
  const perimeter = sum(input.measuredExteriorBaseSegmentsM),
    openings = sum(input.observedDoorOpeningWidthsM);
  if (openings > perimeter)
    simpleError(
      "openings",
      "Door openings exceed independently measured perimeter.",
    );
  const net = perimeter - openings + sum(input.callerCornerSpliceAllowancesM),
    count = bounded(
      Math.ceil(net / input.usableStockBoardLengthM),
      "boards",
      0,
      1000000,
    );
  return {
    netContinuousBaseboardLengthM: net,
    minimumLengthBudgetWholeBoards: count,
    totalLengthBudgetOffcutM: count * input.usableStockBoardLengthM - net,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredExteriorBaseSegmentsM: [10, 5, 10, 5],
  observedDoorOpeningWidthsM: [2],
  callerCornerSpliceAllowancesM: [0.1, 0.1, 0.1, 0.1],
  usableStockBoardLengthM: 4,
} satisfies Input;
export const exampleOutput = {
  netContinuousBaseboardLengthM: 28.4,
  minimumLengthBudgetWholeBoards: 8,
  totalLengthBudgetOffcutM: 3.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/greenhouse-perimeter-baseboard-length",
  title: "Greenhouse Perimeter Baseboard Length Calculator",
  description:
    "Budget actual exterior base segments minus measured openings plus caller splice allowance; whole boards are aggregate-length lower bound, not feasible cut nesting, construction or structural rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "netContinuousBaseboardLengthM",
      label: "Net continuous baseboard length m",
      kind: "number",
    },
    {
      id: "minimumLengthBudgetWholeBoards",
      label: "Minimum length budget whole boards",
      kind: "number",
    },
    {
      id: "totalLengthBudgetOffcutM",
      label: "Total length budget offcut m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredExteriorBaseSegmentsM:
        value.measuredExteriorBaseSegmentsM as readonly number[],
      observedDoorOpeningWidthsM:
        value.observedDoorOpeningWidthsM as readonly number[],
      callerCornerSpliceAllowancesM:
        value.callerCornerSpliceAllowancesM as readonly number[],
      usableStockBoardLengthM: value.usableStockBoardLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;

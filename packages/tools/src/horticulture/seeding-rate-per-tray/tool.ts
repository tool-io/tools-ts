import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly cellsPerTray: number;
  readonly trayCount: number;
  readonly germinationFraction: number;
  readonly postGerminationSurvivalFraction: number;
  readonly targetCellOccupancyFraction: number;
  readonly handlingLossFraction: number;
}>;
export type Output = Readonly<{
  readonly seedsPerCell: number;
  readonly sownSeedCount: number;
  readonly requiredPurchasedSeedCount: number;
  readonly modelCellOccupancyFraction: number;
}>;
const inputFields = [
  { id: "cellsPerTray", label: "Cells per tray", kind: "integer" },
  { id: "trayCount", label: "Tray count", kind: "integer" },
  { id: "germinationFraction", label: "Germination fraction", kind: "number" },
  {
    id: "postGerminationSurvivalFraction",
    label: "Post germination survival fraction",
    kind: "number",
  },
  {
    id: "targetCellOccupancyFraction",
    label: "Target cell occupancy fraction",
    kind: "number",
  },
  {
    id: "handlingLossFraction",
    label: "Handling loss fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cellsPerTray, "cellsPerTray");
  positive(input.trayCount, "trayCount");
  positive(input.germinationFraction, "germinationFraction");
  positive(
    input.postGerminationSurvivalFraction,
    "postGerminationSurvivalFraction",
  );
  positive(input.targetCellOccupancyFraction, "targetCellOccupancyFraction");
  fraction(input.germinationFraction, "germinationFraction");
  fraction(
    input.postGerminationSurvivalFraction,
    "postGerminationSurvivalFraction",
  );
  fraction(input.targetCellOccupancyFraction, "targetCellOccupancyFraction");
  fraction(input.handlingLossFraction, "handlingLossFraction");
  count(input.cellsPerTray, "cellsPerTray");
  count(input.trayCount, "trayCount");
  if (input.handlingLossFraction === 1)
    simpleError("handlingLossFraction", "Handling loss below one required.");
  const p = input.germinationFraction * input.postGerminationSurvivalFraction;
  if (p < 1 && input.targetCellOccupancyFraction === 1)
    simpleError(
      "targetCellOccupancyFraction",
      "Perfect occupancy impossible with finite seeds when independent success is below one.",
    );
  const seedsPerCell =
      p === 1
        ? 1
        : count(
            Math.max(
              1,
              Math.ceil(
                Math.log1p(-input.targetCellOccupancyFraction) / Math.log1p(-p),
              ),
            ),
            "seedsPerCell",
          ),
    sownSeedCount = count(
      seedsPerCell * input.cellsPerTray * input.trayCount,
      "sownSeedCount",
    );
  return {
    seedsPerCell,
    sownSeedCount,
    requiredPurchasedSeedCount: count(
      Math.ceil(sownSeedCount / (1 - input.handlingLossFraction)),
      "requiredPurchasedSeedCount",
    ),
    modelCellOccupancyFraction:
      p === 1 ? 1 : -Math.expm1(seedsPerCell * Math.log1p(-p)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cellsPerTray: 100,
  trayCount: 2,
  germinationFraction: 0.8,
  postGerminationSurvivalFraction: 0.9,
  targetCellOccupancyFraction: 0.95,
  handlingLossFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  seedsPerCell: 3,
  sownSeedCount: 600,
  requiredPurchasedSeedCount: 667,
  modelCellOccupancyFraction: 0.978048,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/seeding-rate-per-tray",
  title: "Seeding Rate Per Tray",
  description:
    "Invert independent seed-to-surviving-plant probability to whole seeds per tray cell for caller occupancy target, then include purchasing loss; independence excludes shared cell failures and crowding effects.",
  inputs: inputFields,
  outputs: [
    { id: "seedsPerCell", label: "Seeds per cell", kind: "number" },
    { id: "sownSeedCount", label: "Sown seed count", kind: "number" },
    {
      id: "requiredPurchasedSeedCount",
      label: "Required purchased seed count",
      kind: "number",
    },
    {
      id: "modelCellOccupancyFraction",
      label: "Model cell occupancy fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cellsPerTray: value.cellsPerTray as number,
      trayCount: value.trayCount as number,
      germinationFraction: value.germinationFraction as number,
      postGerminationSurvivalFraction:
        value.postGerminationSurvivalFraction as number,
      targetCellOccupancyFraction: value.targetCellOccupancyFraction as number,
      handlingLossFraction: value.handlingLossFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

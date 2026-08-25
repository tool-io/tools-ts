import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CellarStoragePlannerInput = {
  readonly bottlesPerShelf: number;
  readonly currentBottles: number;
  readonly racks: number;
  readonly shelvesPerRack: number;
};

export type CellarStoragePlannerOutput = {
  readonly capacityBottles: number;
  readonly utilizationPercent: number;
};

export const cellarStoragePlannerExample = {
  input: {
    bottlesPerShelf: 50,
    currentBottles: 1800,
    racks: 10,
    shelvesPerRack: 5,
  },
  output: {
    capacityBottles: 2500,
    utilizationPercent: 72,
  },
} satisfies ToolExample<CellarStoragePlannerInput, CellarStoragePlannerOutput>;

export const calculateCellarStorage = (
  input: CellarStoragePlannerInput,
): CellarStoragePlannerOutput => {
  const capacity = input.racks * input.shelvesPerRack * input.bottlesPerShelf;
  return {
    capacityBottles: roundStatistic(capacity),
    utilizationPercent: roundStatistic((input.currentBottles / capacity) * 100),
  };
};

export const cellarStoragePlannerTool = createSimpleTool({
  calculate: (input) =>
    calculateCellarStorage(input as unknown as CellarStoragePlannerInput),
  description:
    "Plan private cellar storage from rack geometry and show how full the space currently runs.",
  id: "oenology/cellar-storage-planner",
  inputs: [
    {
      description: "Standard bottles held on one shelf.",
      id: "bottlesPerShelf",
      kind: "integer",
      label: "Bottles per shelf",
      maximum: 10000,
      minimum: 1,
    },
    {
      description: "Bottles already laid down.",
      id: "currentBottles",
      kind: "integer",
      label: "Current bottles",
      maximum: 1000000,
      minimum: 0,
    },
    {
      description: "Racks in the cellar space.",
      id: "racks",
      kind: "integer",
      label: "Racks",
      maximum: 10000,
      minimum: 1,
    },
    {
      description: "Shelving rows per rack.",
      id: "shelvesPerRack",
      kind: "integer",
      label: "Shelves per rack",
      maximum: 1000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Total standard-bottle capacity of the space.",
      id: "capacityBottles",
      kind: "integer",
      label: "Capacity",
    },
    {
      description: "Share of capacity already occupied.",
      id: "utilizationPercent",
      kind: "number",
      label: "Utilization",
      unit: "%",
    },
  ],
  title: "Cellar Capacity Bottle Storage Planner",
});
export const runCellarStoragePlanner = cellarStoragePlannerTool.execute;
export default cellarStoragePlannerTool;

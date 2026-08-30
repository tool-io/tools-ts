import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly classSize: number;
  readonly rowsCapacity: number;
  readonly uCapacity: number;
  readonly clustersCapacity: number;
  readonly prioritizePeerDiscussion: boolean;
}>;
export type Output = Readonly<{
  readonly feasibleLayouts: readonly string[];
  readonly selectedLayout: string;
}>;
export const calculate = (input: Input): Output => {
  const n = input.classSize;
  if (
    !Number.isSafeInteger(n) ||
    n <= 0 ||
    [input.rowsCapacity, input.uCapacity, input.clustersCapacity].some(
      (v) => !Number.isSafeInteger(v) || v < 0,
    )
  )
    simpleError(
      "classSize",
      "Positive class size and nonnegative whole-seat capacities required.",
    );
  const layouts = [
      ["rows", input.rowsCapacity],
      ["u", input.uCapacity],
      ["clusters", input.clustersCapacity],
    ] as const,
    feasibleLayouts = layouts
      .filter(([, capacity]) => capacity >= n)
      .map(([id]) => id);
  if (!feasibleLayouts.length)
    simpleError("classSize", "No seating layout fits the class.");
  const preference: readonly (typeof layouts)[number][0][] =
    input.prioritizePeerDiscussion
      ? ["clusters", "u", "rows"]
      : ["rows", "u", "clusters"];
  return {
    feasibleLayouts,
    selectedLayout: preference.find((id) => feasibleLayouts.includes(id))!,
  };
};
export const exampleInput = {
  classSize: 24,
  rowsCapacity: 30,
  uCapacity: 20,
  clustersCapacity: 26,
  prioritizePeerDiscussion: true,
} satisfies Input;
export const exampleOutput = {
  feasibleLayouts: ["rows", "clusters"],
  selectedLayout: "clusters",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/seating-capacity-selector",
  title: "Seating Capacity Selector",
  description:
    "Choose a feasible classroom seating layout by capacity and interaction priority.",
  inputs: [
    { id: "classSize", label: "Class size", kind: "number" },
    { id: "rowsCapacity", label: "Rows capacity", kind: "number" },
    { id: "uCapacity", label: "U capacity", kind: "number" },
    { id: "clustersCapacity", label: "Clusters capacity", kind: "number" },
    {
      id: "prioritizePeerDiscussion",
      label: "Prioritize peer discussion",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "feasibleLayouts", label: "Feasible layouts", kind: "stringList" },
    { id: "selectedLayout", label: "Selected layout", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      classSize: value.classSize as number,
      rowsCapacity: value.rowsCapacity as number,
      uCapacity: value.uCapacity as number,
      clustersCapacity: value.clustersCapacity as number,
      prioritizePeerDiscussion: value.prioritizePeerDiscussion as boolean,
    }),
});
export const run = tool.execute;
export default tool;

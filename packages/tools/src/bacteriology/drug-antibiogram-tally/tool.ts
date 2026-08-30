import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly isolateIds: readonly string[];
  readonly drugNames: readonly string[];
  readonly resultCodes: readonly string[];
  readonly minimumIsolates: number;
}>;
export type Output = Readonly<{
  readonly drugs: readonly string[];
  readonly testedIsolateCounts: readonly number[];
  readonly susceptiblePercentages: readonly number[];
  readonly adequateSampleFlags: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.isolateIds, input.drugNames, "isolateIds");
  aligned(input.isolateIds, input.resultCodes, "isolateIds");
  count(input.minimumIsolates, "minimumIsolates", 1);
  const groups = new Map<string, Map<string, string>>();
  input.drugNames.forEach((drug, i) => {
    const id = input.isolateIds[i],
      code = input.resultCodes[i];
    if (!drug.trim() || !id.trim() || !["S", "I", "R"].includes(code))
      simpleError(
        "resultCodes",
        "Nonempty isolate/drug labels and S/I/R codes required.",
      );
    if (!groups.has(drug)) groups.set(drug, new Map());
    const calls = groups.get(drug)!;
    if (calls.has(id) && calls.get(id) !== code)
      simpleError("resultCodes", "Repeated isolate/drug pairs disagree.");
    calls.set(id, code);
  });
  const drugs = [...groups.keys()],
    testedIsolateCounts = drugs.map((d) => groups.get(d)!.size),
    susceptiblePercentages = drugs.map(
      (d) =>
        (100 * [...groups.get(d)!.values()].filter((v) => v === "S").length) /
        groups.get(d)!.size,
    );
  return {
    drugs,
    testedIsolateCounts,
    susceptiblePercentages,
    adequateSampleFlags: testedIsolateCounts.map((v) =>
      Number(v >= input.minimumIsolates),
    ),
  };
};
export const exampleInput = {
  isolateIds: ["A", "B", "A"],
  drugNames: ["amp", "amp", "mero"],
  resultCodes: ["S", "R", "S"],
  minimumIsolates: 2,
} satisfies Input;
export const exampleOutput = {
  drugs: ["amp", "mero"],
  testedIsolateCounts: [2, 1],
  susceptiblePercentages: [50, 100],
  adequateSampleFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/drug-antibiogram-tally",
  title: "Drug Antibiogram Tally",
  description:
    "Deduplicate isolate/drug results and compute drug-specific susceptibility percentages with a caller minimum sample size; breakpoints must already be applied.",
  inputs: [
    { id: "isolateIds", label: "Isolate ids", kind: "stringList" },
    { id: "drugNames", label: "Drug names", kind: "stringList" },
    { id: "resultCodes", label: "Result codes", kind: "stringList" },
    {
      id: "minimumIsolates",
      label: "Minimum isolates",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "drugs", label: "Drugs", kind: "stringList" },
    {
      id: "testedIsolateCounts",
      label: "Tested isolate counts",
      kind: "numberList",
    },
    {
      id: "susceptiblePercentages",
      label: "Susceptible percentages",
      kind: "numberList",
    },
    {
      id: "adequateSampleFlags",
      label: "Adequate sample flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      isolateIds: value.isolateIds as readonly string[],
      drugNames: value.drugNames as readonly string[],
      resultCodes: value.resultCodes as readonly string[],
      minimumIsolates: value.minimumIsolates as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualRecordedCanalIds: readonly string[];
  readonly actualIrrigationVolumesMl: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedCanalIds",
    label: "Actual recorded canal ids",
    kind: "stringList",
  },
  {
    id: "actualIrrigationVolumesMl",
    label: "Actual irrigation volumes ml",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualRecordedCanalIds,
    input.actualIrrigationVolumesMl,
    "events",
  );
  if (
    !input.actualRecordedCanalIds.length ||
    input.actualRecordedCanalIds.some((v) => !v.trim())
  )
    simpleError("canals", "Actual explicit canal/event records.");
  input.actualIrrigationVolumesMl.forEach((v) => nonnegative(v, "volume"));
  const ids = [...new Set(input.actualRecordedCanalIds)];
  return {
    observedCanalIds: ids,
    observedVolumesMlByCanal: ids.map((id) =>
      sum(
        input.actualIrrigationVolumesMl.filter(
          (_, i) => input.actualRecordedCanalIds[i] === id,
        ),
      ),
    ),
    observedTotalIrrigationMl: sum(input.actualIrrigationVolumesMl),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedCanalIds: ["canal-a", "canal-a", "canal-b"],
    actualIrrigationVolumesMl: [1, 2, 4],
  },
  output: {
    result: {
      observedCanalIds: ["canal-a", "canal-b"],
      observedVolumesMlByCanal: [3, 4],
      observedTotalIrrigationMl: 7,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/irrigation-volume-per-canial",
  title: "Irrigation Volume Per Canal Calculator",
  description:
    "Actual disjoint irrigation event inventory grouped by independently identified canal. Not irrigation volume recommendation, exposure safety, clinical effectiveness or retained intracanal volume.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  binary,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPotatoMonitorLarvaCounts: readonly number[];
  readonly observedMonitorExposureDays: readonly number[];
  readonly monitorEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownObservedLarvaCount: number;
  readonly knownMonitorDays: number;
  readonly pooledLarvaePerKnownMonitorDay: number;
  readonly unknownMonitorCount: number;
}>;
const inputFields = [
  {
    id: "observedPotatoMonitorLarvaCounts",
    label: "Observed potato monitor larva counts",
    kind: "numberList",
  },
  {
    id: "observedMonitorExposureDays",
    label: "Observed monitor exposure days",
    kind: "numberList",
  },
  {
    id: "monitorEvidenceFlags",
    label: "Monitor evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMonitorExposureDays.forEach((v) =>
    positive(v, "observedMonitorExposureDays"),
  );
  binary(input.monitorEvidenceFlags, "monitorEvidenceFlags");
  aligned(
    input.observedPotatoMonitorLarvaCounts,
    input.observedMonitorExposureDays,
    "observedPotatoMonitorLarvaCounts",
  );
  aligned(
    input.observedPotatoMonitorLarvaCounts,
    input.monitorEvidenceFlags,
    "observedPotatoMonitorLarvaCounts",
  );
  input.observedPotatoMonitorLarvaCounts.forEach((v) =>
    bounded(v, "larvae", 0, 1000000),
  );
  const days = sum(
    input.observedMonitorExposureDays.filter(
      (_, i) => input.monitorEvidenceFlags[i] === 1,
    ),
  );
  positive(days, "knownExposure");
  const counts = sum(
    input.observedPotatoMonitorLarvaCounts.filter(
      (_, i) => input.monitorEvidenceFlags[i] === 1,
    ),
  );
  return {
    knownObservedLarvaCount: counts,
    knownMonitorDays: days,
    pooledLarvaePerKnownMonitorDay: counts / days,
    unknownMonitorCount: input.monitorEvidenceFlags.filter((v) => v === 0)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPotatoMonitorLarvaCounts: [2, 0, 8],
  observedMonitorExposureDays: [1, 2, 2],
  monitorEvidenceFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownObservedLarvaCount: 10,
  knownMonitorDays: 3,
  pooledLarvaePerKnownMonitorDay: 3.3333333333333335,
  unknownMonitorCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/fungus-gnat-potato-monitor-count",
  title: "Fungus Gnat Potato Monitor Count Tool",
  description:
    "Pool actual potato-monitor counted larvae by known monitor-day exposure, excluding missing evidence; no species confirmation, universal infestation threshold or pesticide recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownObservedLarvaCount",
      label: "Known observed larva count",
      kind: "number",
    },
    { id: "knownMonitorDays", label: "Known monitor days", kind: "number" },
    {
      id: "pooledLarvaePerKnownMonitorDay",
      label: "Pooled larvae per known monitor day",
      kind: "number",
    },
    {
      id: "unknownMonitorCount",
      label: "Unknown monitor count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPotatoMonitorLarvaCounts:
        value.observedPotatoMonitorLarvaCounts as readonly number[],
      observedMonitorExposureDays:
        value.observedMonitorExposureDays as readonly number[],
      monitorEvidenceFlags: value.monitorEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

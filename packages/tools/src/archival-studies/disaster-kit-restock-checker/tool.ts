import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerDisasterKitTargetCounts: readonly number[];
  readonly observedUsableKitCounts: readonly number[];
  readonly expiredKitCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly restockDeficitsByItem: readonly number[];
  readonly usableInventoryExcessesByItem: readonly number[];
  readonly totalExpiredInventoryCount: number;
  readonly fullyStockedUnderCallerPlan: boolean;
}>;
const inputFields = [
  {
    id: "callerDisasterKitTargetCounts",
    label: "Caller disaster kit target counts",
    kind: "numberList",
  },
  {
    id: "observedUsableKitCounts",
    label: "Observed usable kit counts",
    kind: "numberList",
  },
  { id: "expiredKitCounts", label: "Expired kit counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerDisasterKitTargetCounts.forEach((v) =>
    count(v, "callerDisasterKitTargetCounts"),
  );
  input.observedUsableKitCounts.forEach((v) =>
    count(v, "observedUsableKitCounts"),
  );
  input.expiredKitCounts.forEach((v) => count(v, "expiredKitCounts"));
  aligned(
    input.callerDisasterKitTargetCounts,
    input.observedUsableKitCounts,
    "callerDisasterKitTargetCounts",
  );
  aligned(
    input.callerDisasterKitTargetCounts,
    input.expiredKitCounts,
    "callerDisasterKitTargetCounts",
  );
  const d = input.callerDisasterKitTargetCounts.map((v, i) =>
    Math.max(0, v - input.observedUsableKitCounts[i]),
  );
  return {
    restockDeficitsByItem: d,
    usableInventoryExcessesByItem: d.map((_, i) =>
      Math.max(
        0,
        input.observedUsableKitCounts[i] -
          input.callerDisasterKitTargetCounts[i],
      ),
    ),
    totalExpiredInventoryCount: totalCount(input.expiredKitCounts, "expired"),
    fullyStockedUnderCallerPlan: d.every((v) => v === 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDisasterKitTargetCounts: [5, 10, 2],
  observedUsableKitCounts: [3, 12, 1],
  expiredKitCounts: [1, 2, 0],
} satisfies Input;
export const exampleOutput = {
  restockDeficitsByItem: [2, 0, 1],
  usableInventoryExcessesByItem: [0, 2, 0],
  totalExpiredInventoryCount: 3,
  fullyStockedUnderCallerPlan: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/disaster-kit-restock-checker",
  title: "Disaster Kit Restock Checklist Completeness Checker",
  description:
    "Audit actual usable disaster-kit stock against caller quantities, retaining expired inventory separately; quantities alone do not prove readiness, suitable PPE or safe disaster response.",
  inputs: inputFields,
  outputs: [
    {
      id: "restockDeficitsByItem",
      label: "Restock deficits by item",
      kind: "numberList",
    },
    {
      id: "usableInventoryExcessesByItem",
      label: "Usable inventory excesses by item",
      kind: "numberList",
    },
    {
      id: "totalExpiredInventoryCount",
      label: "Total expired inventory count",
      kind: "number",
    },
    {
      id: "fullyStockedUnderCallerPlan",
      label: "Fully stocked under caller plan",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDisasterKitTargetCounts:
        value.callerDisasterKitTargetCounts as readonly number[],
      observedUsableKitCounts:
        value.observedUsableKitCounts as readonly number[],
      expiredKitCounts: value.expiredKitCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

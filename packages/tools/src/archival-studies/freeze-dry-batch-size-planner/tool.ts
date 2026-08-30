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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly orderedWetBoxMassesKg: readonly number[];
  readonly orderedWetBoxVolumesM3: readonly number[];
  readonly declaredBatchPayloadLimitKg: number;
  readonly declaredBatchVolumeLimitM3: number;
}>;
export type Output = Readonly<{
  readonly orderedFreezeDryBatchItemIndices: readonly (readonly number[])[];
  readonly batchCount: number;
}>;
const inputFields = [
  {
    id: "orderedWetBoxMassesKg",
    label: "Ordered wet box masses kg",
    kind: "numberList",
  },
  {
    id: "orderedWetBoxVolumesM3",
    label: "Ordered wet box volumes m3",
    kind: "numberList",
  },
  {
    id: "declaredBatchPayloadLimitKg",
    label: "Declared batch payload limit kg",
    kind: "number",
  },
  {
    id: "declaredBatchVolumeLimitM3",
    label: "Declared batch volume limit m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.declaredBatchPayloadLimitKg, "declaredBatchPayloadLimitKg");
  positive(input.declaredBatchVolumeLimitM3, "declaredBatchVolumeLimitM3");
  input.orderedWetBoxMassesKg.forEach((v) =>
    nonnegative(v, "orderedWetBoxMassesKg"),
  );
  input.orderedWetBoxVolumesM3.forEach((v) =>
    nonnegative(v, "orderedWetBoxVolumesM3"),
  );
  aligned(
    input.orderedWetBoxMassesKg,
    input.orderedWetBoxVolumesM3,
    "orderedWetBoxMassesKg",
  );
  if (
    input.orderedWetBoxMassesKg.length > 128 ||
    input.orderedWetBoxMassesKg.some(
      (v, i) =>
        v > input.declaredBatchPayloadLimitKg ||
        input.orderedWetBoxVolumesM3[i] > input.declaredBatchVolumeLimitM3,
    )
  )
    simpleError(
      "boxes",
      "At most 128 boxes each fitting declared mass/volume limits required.",
    );
  const batches: number[][] = [];
  let row: number[] = [],
    mass = 0,
    volume = 0;
  input.orderedWetBoxMassesKg.forEach((v, i) => {
    const x = input.orderedWetBoxVolumesM3[i];
    if (
      row.length &&
      (mass + v > input.declaredBatchPayloadLimitKg ||
        volume + x > input.declaredBatchVolumeLimitM3)
    ) {
      batches.push(row);
      row = [];
      mass = 0;
      volume = 0;
    }
    row.push(i);
    mass += v;
    volume += x;
  });
  if (row.length) batches.push(row);
  return {
    orderedFreezeDryBatchItemIndices: batches,
    batchCount: batches.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedWetBoxMassesKg: [1, 2, 3],
  orderedWetBoxVolumesM3: [2, 2, 3],
  declaredBatchPayloadLimitKg: 3,
  declaredBatchVolumeLimitM3: 5,
} satisfies Input;
export const exampleOutput = {
  orderedFreezeDryBatchItemIndices: [[0, 1], [2]],
  batchCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/freeze-dry-batch-size-planner",
  title: "Freeze Drying Water Damaged Box Batch Size Planner",
  description:
    "Group original-order wet box inventory into sequential batches under caller declared simultaneous volume/mass capacities; greedy order-preserving packing, not globally minimum batches or effective/safe salvage treatment.",
  inputs: inputFields,
  outputs: [
    {
      id: "orderedFreezeDryBatchItemIndices",
      label: "Ordered freeze dry batch item indices",
      kind: "matrix",
    },
    { id: "batchCount", label: "Batch count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orderedWetBoxMassesKg: value.orderedWetBoxMassesKg as readonly number[],
      orderedWetBoxVolumesM3: value.orderedWetBoxVolumesM3 as readonly number[],
      declaredBatchPayloadLimitKg: value.declaredBatchPayloadLimitKg as number,
      declaredBatchVolumeLimitM3: value.declaredBatchVolumeLimitM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

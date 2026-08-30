import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly intervalPrecipitationMm: readonly number[];
  readonly intervalPotentialEtMm: readonly number[];
  readonly soilBucketCapacityMm: number;
  readonly initialBucketStorageMm: number;
}>;
export type Output = Readonly<{
  readonly intervalActualEtMm: readonly number[];
  readonly intervalSurplusesMm: readonly number[];
  readonly intervalDeficitsMm: readonly number[];
  readonly intervalEndStorageMm: readonly number[];
}>;
const inputFields = [
  {
    id: "intervalPrecipitationMm",
    label: "Interval precipitation mm",
    kind: "numberList",
  },
  {
    id: "intervalPotentialEtMm",
    label: "Interval potential et mm",
    kind: "numberList",
  },
  {
    id: "soilBucketCapacityMm",
    label: "Soil bucket capacity mm",
    kind: "number",
  },
  {
    id: "initialBucketStorageMm",
    label: "Initial bucket storage mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalPrecipitationMm.forEach((v) =>
    nonnegative(v, "intervalPrecipitationMm"),
  );
  input.intervalPotentialEtMm.forEach((v) =>
    nonnegative(v, "intervalPotentialEtMm"),
  );
  nonnegative(input.soilBucketCapacityMm, "soilBucketCapacityMm");
  nonnegative(input.initialBucketStorageMm, "initialBucketStorageMm");
  aligned(
    input.intervalPrecipitationMm,
    input.intervalPotentialEtMm,
    "intervalPrecipitationMm",
  );
  if (input.initialBucketStorageMm > input.soilBucketCapacityMm)
    simpleError(
      "initialBucketStorageMm",
      "Initial soil storage within declared capacity required.",
    );
  let storage = input.initialBucketStorageMm;
  const intervalActualEtMm: number[] = [],
    intervalSurplusesMm: number[] = [],
    intervalDeficitsMm: number[] = [],
    intervalEndStorageMm: number[] = [];
  input.intervalPrecipitationMm.forEach((p, i) => {
    const available = storage + p,
      et = Math.min(available, input.intervalPotentialEtMm[i]),
      left = available - et;
    storage = Math.min(left, input.soilBucketCapacityMm);
    intervalActualEtMm.push(et);
    intervalSurplusesMm.push(Math.max(0, left - storage));
    intervalDeficitsMm.push(input.intervalPotentialEtMm[i] - et);
    intervalEndStorageMm.push(storage);
  });
  return {
    intervalActualEtMm,
    intervalSurplusesMm,
    intervalDeficitsMm,
    intervalEndStorageMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalPrecipitationMm: [5, 20],
  intervalPotentialEtMm: [10, 10],
  soilBucketCapacityMm: 10,
  initialBucketStorageMm: 5,
} satisfies Input;
export const exampleOutput = {
  intervalActualEtMm: [10, 10],
  intervalSurplusesMm: [0, 0],
  intervalDeficitsMm: [0, 0],
  intervalEndStorageMm: [0, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/water-balance-surplus-deficit",
  title: "Water Balance Surplus Deficit Classifier",
  description:
    "Conserve sequential single-bucket soil water with precipitation, PET, actual evaporation, overflow surplus and unmet-demand deficit; no groundwater recharge/irrigation guarantee and all bucket processes are declared simplifications.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalActualEtMm",
      label: "Interval actual et mm",
      kind: "numberList",
    },
    {
      id: "intervalSurplusesMm",
      label: "Interval surpluses mm",
      kind: "numberList",
    },
    {
      id: "intervalDeficitsMm",
      label: "Interval deficits mm",
      kind: "numberList",
    },
    {
      id: "intervalEndStorageMm",
      label: "Interval end storage mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalPrecipitationMm:
        value.intervalPrecipitationMm as readonly number[],
      intervalPotentialEtMm: value.intervalPotentialEtMm as readonly number[],
      soilBucketCapacityMm: value.soilBucketCapacityMm as number,
      initialBucketStorageMm: value.initialBucketStorageMm as number,
    }),
});
export const run = tool.execute;
export default tool;

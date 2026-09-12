import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInflowVolumeByInterval: readonly number[];
  readonly actualOutflowVolumeByInterval: readonly number[];
  readonly actualInitialStoredVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInflowVolumeByInterval",
    label: "Actual inflow volume by interval",
    kind: "numberList",
  },
  {
    id: "actualOutflowVolumeByInterval",
    label: "Actual out flow volume by interval",
    kind: "numberList",
  },
  {
    id: "actualInitialStoredVolume",
    label: "Actual initial stored volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualInflowVolumeByInterval,
    input.actualOutflowVolumeByInterval,
    "intervals",
  );
  [
    ...input.actualInflowVolumeByInterval,
    ...input.actualOutflowVolumeByInterval,
    input.actualInitialStoredVolume,
  ].forEach((v) => nonnegative(v, "volume"));
  let s = input.actualInitialStoredVolume;
  const a = input.actualInflowVolumeByInterval.map((v, i) => {
    s += v - input.actualOutflowVolumeByInterval[i];
    if (s < 0)
      simpleError(
        "outflow",
        "Actualstoragecannotbecomenegative;outflowalreadyresolved.",
      );
    return s;
  });
  return {
    actualStorageTrajectory: a,
    actualMaximumStoredVolume: Math.max(input.actualInitialStoredVolume, ...a),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInflowVolumeByInterval: [4, 1, 1],
    actualOutflowVolumeByInterval: [1, 2, 2],
    actualInitialStoredVolume: 0,
  },
  output: {
    result: {
      actualStorageTrajectory: [3, 2, 1],
      actualMaximumStoredVolume: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/greywater-surge-tank-size",
  title: "Plumbing Greywater Surge Tank Size Calculator",
  description:
    "Actual interval grey surge tank inventory trajectory, maximum observed storage, no choose initial pool/orficerate, daily volume proxy or engineer free board/pot ability/safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly cellDiametersMm: readonly number[];
  readonly workerDiameterBoundsMm: readonly number[];
  readonly droneDiameterBoundsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly classificationCodes: readonly number[];
}>;
const inputFields = [
  { id: "cellDiametersMm", label: "Cell diameters mm", kind: "numberList" },
  {
    id: "workerDiameterBoundsMm",
    label: "Worker diameter bounds mm",
    kind: "numberList",
  },
  {
    id: "droneDiameterBoundsMm",
    label: "Drone diameter bounds mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cellDiametersMm.forEach((v) => positive(v, "cellDiametersMm"));
  input.workerDiameterBoundsMm.forEach((v) =>
    positive(v, "workerDiameterBoundsMm"),
  );
  input.droneDiameterBoundsMm.forEach((v) =>
    positive(v, "droneDiameterBoundsMm"),
  );
  if (
    !input.cellDiametersMm.length ||
    input.workerDiameterBoundsMm.length !== 2 ||
    input.droneDiameterBoundsMm.length !== 2 ||
    input.workerDiameterBoundsMm[0] > input.workerDiameterBoundsMm[1] ||
    input.droneDiameterBoundsMm[0] > input.droneDiameterBoundsMm[1]
  )
    simpleError(
      "bounds",
      "Nonempty diameters and ordered two-value calibration bands required.",
    );
  return {
    classificationCodes: input.cellDiametersMm.map((d) => {
      const w =
          d >= input.workerDiameterBoundsMm[0] &&
          d <= input.workerDiameterBoundsMm[1],
        r =
          d >= input.droneDiameterBoundsMm[0] &&
          d <= input.droneDiameterBoundsMm[1];
      return (w ? 1 : 0) + (r ? 2 : 0);
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cellDiametersMm: [4, 5, 6, 7],
  workerDiameterBoundsMm: [4, 5.5],
  droneDiameterBoundsMm: [5, 7],
} satisfies Input;
export const exampleOutput = {
  classificationCodes: [1, 3, 2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/comb-cell-diameter-worker-drone-checker",
  title: "Comb Cell Diameter Worker Drone Checker",
  description:
    "Screen comb diameters against caller worker/drone bands; codes 0 neither, 1 worker, 2 drone, 3 ambiguous overlap, without identifying brood occupants.",
  inputs: inputFields,
  outputs: [
    {
      id: "classificationCodes",
      label: "Classification codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      cellDiametersMm: value.cellDiametersMm as readonly number[],
      workerDiameterBoundsMm: value.workerDiameterBoundsMm as readonly number[],
      droneDiameterBoundsMm: value.droneDiameterBoundsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

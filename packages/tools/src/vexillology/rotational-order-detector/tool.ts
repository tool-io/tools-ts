import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerTestedRotationOrders: readonly number[];
  readonly independentlyWitnessedRotationFlags: readonly number[];
  readonly rotationKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerTestedRotationOrders",
    label: "Caller tested rotation orders",
    kind: "numberList",
  },
  {
    id: "independentlyWitnessedRotationFlags",
    label: "Independently witnessed rotation flags",
    kind: "numberList",
  },
  {
    id: "rotationKnownFlags",
    label: "Rotation known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    new Set(input.callerTestedRotationOrders).size !==
    input.callerTestedRotationOrders.length
  )
    simpleError("orders", "Distinct tested rotation orders.");
  input.callerTestedRotationOrders.forEach((v) => bounded(v, "order", 2, 64));
  aligned(
    input.callerTestedRotationOrders,
    input.independentlyWitnessedRotationFlags,
    "witnesses",
  );
  aligned(input.callerTestedRotationOrders, input.rotationKnownFlags, "known");
  binary(input.independentlyWitnessedRotationFlags, "witnesses");
  binary(input.rotationKnownFlags, "known");
  return {
    highestWitnessedTestedOrder: Math.max(
      1,
      ...input.callerTestedRotationOrders.filter(
        (_, i) =>
          input.independentlyWitnessedRotationFlags[i] &&
          input.rotationKnownFlags[i],
      ),
    ),
    unknownTestedOrders: input.callerTestedRotationOrders.filter(
      (_, i) => !input.rotationKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerTestedRotationOrders: [2, 4, 6],
    independentlyWitnessedRotationFlags: [1, 1, 0],
    rotationKnownFlags: [1, 1, 0],
  },
  output: {
    result: { highestWitnessedTestedOrder: 4, unknownTestedOrders: [6] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/rotational-order-detector",
  title: "Rotational Symmetry Order Detector",
  description:
    "Highest independently witnessed finite tested rotational order, not complete symmetry group or inference from untested angles; missing tests retained.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

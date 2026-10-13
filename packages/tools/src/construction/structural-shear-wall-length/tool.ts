import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualLateralShearDemand: number;
  readonly callerIndependentlyEstablishedDesignCapacityPerWallLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLateralShearDemand",
    label: "Actual lateral shear demand",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedDesignCapacityPerWallLength",
    label: "Caller independently established design capacity per wall length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualLateralShearDemand, "actualLateralShearDemand");
  positive(
    input.callerIndependentlyEstablishedDesignCapacityPerWallLength,
    "callerIndependentlyEstablishedDesignCapacityPerWallLength",
  );
  return {
    value:
      input.actualLateralShearDemand /
      input.callerIndependentlyEstablishedDesignCapacityPerWallLength,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLateralShearDemand: 10,
    callerIndependentlyEstablishedDesignCapacityPerWallLength: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/structural-shear-wall-length",
  title: "Shear Wall Length Calculator",
  description:
    "Restricted demand/actual engineer established capacity per length wall sum length; no wall configuration, connection/load path or safe-design selection. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

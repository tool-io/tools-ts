import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerActualLiquidSpecificGravity: number;
  readonly actualLiquidFlowUsGallonsPerMinute: number;
  readonly callerVerifiedValveCv: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerActualLiquidSpecificGravity",
    label: "Caller actual liquid specific gravity",
    kind: "number",
  },
  {
    id: "actualLiquidFlowUsGallonsPerMinute",
    label: "Actual liquid flow us gallons per minute",
    kind: "number",
  },
  {
    id: "callerVerifiedValveCv",
    label: "Caller verified valve cv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerActualLiquidSpecificGravity,
    "callerActualLiquidSpecificGravity",
  );
  nonnegative(
    input.actualLiquidFlowUsGallonsPerMinute,
    "actualLiquidFlowUsGallonsPerMinute",
  );
  positive(input.callerVerifiedValveCv, "callerVerifiedValveCv");
  return {
    value:
      input.callerActualLiquidSpecificGravity *
      (input.actualLiquidFlowUsGallonsPerMinute /
        input.callerVerifiedValveCv) **
        2,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerActualLiquidSpecificGravity: 1,
    actualLiquidFlowUsGallonsPerMinute: 2,
    callerVerifiedValveCv: 1,
  },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/valve-pressure-drop-from-cv",
  title: "Plumbing Valve Pressure Drop From Cv Calculator",
  description:
    "Liquid valve \u0394Ppsi=SG(QUSgpm/Cv)\u00b2, independently verified incompressible noncavitatingCvbranch, not gason/off critical flow. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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

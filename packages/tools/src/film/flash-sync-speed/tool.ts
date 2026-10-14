import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFullCurtainTravelSeconds: number;
  readonly callerIndependentlyRequiredSyncMarginSeconds: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualFullCurtainTravelSeconds",
    label: "Actual full curtain travel seconds",
    kind: "number",
  },
  {
    id: "callerIndependentlyRequiredSyncMarginSeconds",
    label: "Caller independently required sync margin seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualFullCurtainTravelSeconds,
    "actualFullCurtainTravelSeconds",
  );
  nonnegative(
    input.callerIndependentlyRequiredSyncMarginSeconds,
    "callerIndependentlyRequiredSyncMarginSeconds",
  );
  return {
    value:
      1 /
      (input.actualFullCurtainTravelSeconds +
        input.callerIndependentlyRequiredSyncMarginSeconds),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFullCurtainTravelSeconds: 0.01,
    callerIndependentlyRequiredSyncMarginSeconds: 0,
  },
  output: { result: { value: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/flash-sync-speed",
  title: "Flash Sync Speed Calculator",
  description:
    "Maximum full-open mechanical sync reciprocalHz1/(actual curtain travel time+independent margin), not flashpulseHSS or guarantee artifact free timing.",
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

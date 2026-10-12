import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPondDisplacedWaterVolume: number;
  readonly actualObservedStorageVolumeChange: number;
  readonly actualObservationSeconds: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPondDisplacedWaterVolume",
    label: "Actual pond displaced water volume",
    kind: "number",
  },
  {
    id: "actualObservedStorageVolumeChange",
    label: "Actual observed storage volume change",
    kind: "number",
  },
  {
    id: "actualObservationSeconds",
    label: "Actual observation seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualPondDisplacedWaterVolume,
    "actualPondDisplacedWaterVolume",
  );
  positive(input.actualObservationSeconds, "actualObservationSeconds");
  if (
    input.actualPondDisplacedWaterVolume +
      input.actualObservedStorageVolumeChange <
    0
  )
    simpleError("flow", "Declarednonnegativeinflowbranch.");
  return {
    value:
      (input.actualPondDisplacedWaterVolume +
        input.actualObservedStorageVolumeChange) /
      input.actualObservationSeconds,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPondDisplacedWaterVolume: 10,
    actualObservedStorageVolumeChange: 2,
    actualObservationSeconds: 2,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/flow-rate-pond",
  title: "Pond Flow Rate Calculator",
  description:
    "Actual pond replacement volume PLUS signed storage change over actual observed time inflow bookkeeping, not volume/desired retention forecast.",
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

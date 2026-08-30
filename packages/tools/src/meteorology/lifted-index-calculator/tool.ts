import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";

export type Input = Readonly<{
  readonly environment500HpaTemperatureC: number;
  readonly suppliedSurfaceParcel500HpaTemperatureC: number;
}>;
export type Output = Readonly<{ readonly liftedIndexC: number }>;
const inputFields = [
  {
    id: "environment500HpaTemperatureC",
    label: "Environment500 hpa temperature c",
    kind: "number",
  },
  {
    id: "suppliedSurfaceParcel500HpaTemperatureC",
    label: "Supplied surface parcel500 hpa temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    liftedIndexC:
      input.environment500HpaTemperatureC -
      input.suppliedSurfaceParcel500HpaTemperatureC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  environment500HpaTemperatureC: -10,
  suppliedSurfaceParcel500HpaTemperatureC: -15,
} satisfies Input;
export const exampleOutput = { liftedIndexC: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/lifted-index-calculator",
  title: "Lifted Index",
  description:
    "Difference measured environmental and caller independently lifted surface-parcel temperatures at 500 hPa; parcel lift is not computed and index alone does not classify storm occurrence.",
  inputs: inputFields,
  outputs: [{ id: "liftedIndexC", label: "Lifted index c", kind: "number" }],
  calculate: (value) =>
    calculate({
      environment500HpaTemperatureC:
        value.environment500HpaTemperatureC as number,
      suppliedSurfaceParcel500HpaTemperatureC:
        value.suppliedSurfaceParcel500HpaTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;

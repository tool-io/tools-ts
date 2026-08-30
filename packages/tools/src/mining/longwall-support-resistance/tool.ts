import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly roofDesignPressureMpa: number;
  readonly tributaryRoofAreaM2: number;
  readonly designFactor: number;
  readonly availableSupportResistanceKn: number;
}>;
export type Output = Readonly<{
  readonly requiredResistanceKn: number;
  readonly resistanceMarginKn: number;
  readonly meetsCallerLoad: boolean;
}>;
const inputFields = [
  {
    id: "roofDesignPressureMpa",
    label: "Roof design pressure mpa",
    kind: "number",
  },
  {
    id: "tributaryRoofAreaM2",
    label: "Tributary roof area m2",
    kind: "number",
  },
  { id: "designFactor", label: "Design factor", kind: "number" },
  {
    id: "availableSupportResistanceKn",
    label: "Available support resistance kn",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tributaryRoofAreaM2, "tributaryRoofAreaM2");
  nonnegative(input.roofDesignPressureMpa, "roofDesignPressureMpa");
  nonnegative(
    input.availableSupportResistanceKn,
    "availableSupportResistanceKn",
  );
  if (input.designFactor < 1)
    simpleError("designFactor", "Factor at least one required.");
  const requiredResistanceKn =
    1000 *
    input.roofDesignPressureMpa *
    input.tributaryRoofAreaM2 *
    input.designFactor;
  return {
    requiredResistanceKn,
    resistanceMarginKn:
      input.availableSupportResistanceKn - requiredResistanceKn,
    meetsCallerLoad: input.availableSupportResistanceKn >= requiredResistanceKn,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roofDesignPressureMpa: 0.5,
  tributaryRoofAreaM2: 8,
  designFactor: 1.5,
  availableSupportResistanceKn: 5000,
} satisfies Input;
export const exampleOutput = {
  requiredResistanceKn: 6000,
  resistanceMarginKn: -1000,
  meetsCallerLoad: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/longwall-support-resistance",
  title: "Longwall Support Resistance",
  description:
    "Screen longwall resistance against supplied pressure×area factored load; canopy contact, dynamic roof behavior and hydraulic reliability are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredResistanceKn",
      label: "Required resistance kn",
      kind: "number",
    },
    { id: "resistanceMarginKn", label: "Resistance margin kn", kind: "number" },
    { id: "meetsCallerLoad", label: "Meets caller load", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      roofDesignPressureMpa: value.roofDesignPressureMpa as number,
      tributaryRoofAreaM2: value.tributaryRoofAreaM2 as number,
      designFactor: value.designFactor as number,
      availableSupportResistanceKn:
        value.availableSupportResistanceKn as number,
    }),
});
export const run = tool.execute;
export default tool;

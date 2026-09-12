import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInitialChlorineConcentration: number;
  readonly actualLaterChlorineConcentration: number;
  readonly actualElapsedTime: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialChlorineConcentration",
    label: "Actual initial chlorine concentration",
    kind: "number",
  },
  {
    id: "actualLaterChlorineConcentration",
    label: "Actual later chlorine concentration",
    kind: "number",
  },
  { id: "actualElapsedTime", label: "Actual elapsed time", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualInitialChlorineConcentration,
    "actualInitialChlorineConcentration",
  );
  positive(
    input.actualLaterChlorineConcentration,
    "actualLaterChlorineConcentration",
  );
  positive(input.actualElapsedTime, "actualElapsedTime");
  return {
    value:
      Math.log(
        input.actualInitialChlorineConcentration /
          input.actualLaterChlorineConcentration,
      ) / input.actualElapsedTime,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialChlorineConcentration: 2,
    actualLaterChlorineConcentration: 1,
    actualElapsedTime: 2,
  },
  output: { result: { value: 0.34657359027997264 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/chlorine-decay-rate",
  title: "Plumbing Chlorine Decay Rate Calculator",
  description:
    "Actual conditional first-order chlorine two endpoint decayk=ln(C0/Ct)/t, positive concentrations, signed negative growth retained; not guaranteed dis infection kinetics. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly subsectionWettedPerimeters: readonly number[];
  readonly callerMatchedManningNs: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "subsectionWettedPerimeters",
    label: "Subsection wetted perimeters",
    kind: "numberList",
  },
  {
    id: "callerMatchedManningNs",
    label: "Caller matched manning ns",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.subsectionWettedPerimeters.length)
    simpleError("subsectionWettedPerimeters", "Actual nonempty observations.");
  input.subsectionWettedPerimeters.forEach((v) =>
    positive(v, "subsectionWettedPerimeters"),
  );
  if (!input.callerMatchedManningNs.length)
    simpleError("callerMatchedManningNs", "Actual nonempty observations.");
  input.callerMatchedManningNs.forEach((v) =>
    positive(v, "callerMatchedManningNs"),
  );
  aligned(
    input.subsectionWettedPerimeters,
    input.callerMatchedManningNs,
    "sections",
  );
  return {
    value:
      (sum(
        input.subsectionWettedPerimeters.map(
          (v, i) => v * input.callerMatchedManningNs[i] ** 1.5,
        ),
      ) /
        sum(input.subsectionWettedPerimeters)) **
      (2 / 3),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    subsectionWettedPerimeters: [1, 2],
    callerMatchedManningNs: [0.03, 0.03],
  },
  output: { result: { value: 0.03 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/channel-roughness-composite",
  title: "Composite Channel Roughness Calculator",
  description:
    "Declared Horton\u2013Einstein perimeter-composite Manningn=(\u03a3P n^1.5/\u03a3P)^2/3, not area weighted arithmetic roughness or hydraulic flow guarantee. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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

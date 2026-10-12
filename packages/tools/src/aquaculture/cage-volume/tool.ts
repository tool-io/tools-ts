import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualDeformedNetCageSectionAreas: readonly number[];
  readonly actualSectionDepthsMeters: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDeformedNetCageSectionAreas",
    label: "Actual deformed net cage section areas",
    kind: "numberList",
  },
  {
    id: "actualSectionDepthsMeters",
    label: "Actual section depths meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.actualDeformedNetCageSectionAreas.length)
    simpleError(
      "actualDeformedNetCageSectionAreas",
      "Actual nonempty observations.",
    );
  input.actualDeformedNetCageSectionAreas.forEach((v) =>
    nonnegative(v, "actualDeformedNetCageSectionAreas"),
  );
  if (!input.actualSectionDepthsMeters.length)
    simpleError("actualSectionDepthsMeters", "Actual nonempty observations.");
  input.actualSectionDepthsMeters.forEach((v) =>
    nonnegative(v, "actualSectionDepthsMeters"),
  );
  aligned(
    input.actualDeformedNetCageSectionAreas,
    input.actualSectionDepthsMeters,
    "sections",
  );
  if (
    input.actualSectionDepthsMeters.length < 2 ||
    input.actualSectionDepthsMeters.some(
      (v, i) => i && v <= input.actualSectionDepthsMeters[i - 1],
    )
  )
    simpleError("depth", "Actualstrictlyincreasingdepths≥2.");
  return {
    value: sum(
      input.actualDeformedNetCageSectionAreas
        .map(
          (v, i) =>
            ((v + input.actualDeformedNetCageSectionAreas[i + 1]) / 2) *
            (input.actualSectionDepthsMeters[i + 1] -
              input.actualSectionDepthsMeters[i]),
        )
        .slice(0, -1),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDeformedNetCageSectionAreas: [2, 4],
    actualSectionDepthsMeters: [0, 2],
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/cage-volume",
  title: "Cage Volume Calculator",
  description:
    "Actual deformed cage volume trapezoid section area versus measured depth profile, no nominal box volume or undeformedcagesizeguarantee.",
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

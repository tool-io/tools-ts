import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualWettedRacewayCrossSectionAreaSquareMeters: number;
  readonly actualObservedMeanThroughVelocityMetersPerSecond: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualWettedRacewayCrossSectionAreaSquareMeters",
    label: "Actual wetted raceway cross section area square meters",
    kind: "number",
  },
  {
    id: "actualObservedMeanThroughVelocityMetersPerSecond",
    label: "Actual observed mean through velocity meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualWettedRacewayCrossSectionAreaSquareMeters,
    "actualWettedRacewayCrossSectionAreaSquareMeters",
  );
  nonnegative(
    input.actualObservedMeanThroughVelocityMetersPerSecond,
    "actualObservedMeanThroughVelocityMetersPerSecond",
  );
  return {
    value:
      input.actualWettedRacewayCrossSectionAreaSquareMeters *
      input.actualObservedMeanThroughVelocityMetersPerSecond,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualWettedRacewayCrossSectionAreaSquareMeters: 3,
    actualObservedMeanThroughVelocityMetersPerSecond: 2,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/flow-rate-raceway",
  title: "Raceway Flow Rate Calculator",
  description:
    "Actual raceway section area\u00d7observedmeanvelocityflowm\u00b3/s, no recirculationdesign or gas transfer guarantee.",
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

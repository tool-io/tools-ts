import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualEntranceDatumElevationMeters: number;
  readonly actualStationElevationMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEntranceDatumElevationMeters",
    label: "Actual entrance datum elevation meters",
    kind: "number",
  },
  {
    id: "actualStationElevationMeters",
    label: "Actual station elevation meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    signedDepthBelowEntranceMeters:
      input.actualEntranceDatumElevationMeters -
      input.actualStationElevationMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEntranceDatumElevationMeters: 10,
    actualStationElevationMeters: 3,
  },
  output: { result: { signedDepthBelowEntranceMeters: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/below-entrance-datum-converter",
  title: "Depth Below Entrance Datum Converter",
  description:
    "Signed station depth below actual common-datum entrance; negative means above entrance, not absolute cave-depth record.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedDepthBelowEntranceMeters: { type: "number" } },
        required: ["signedDepthBelowEntranceMeters"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

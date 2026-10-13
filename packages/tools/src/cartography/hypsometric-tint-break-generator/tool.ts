import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly minimumElevationM: number;
  readonly maximumElevationM: number;
  readonly bands: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "minimumElevationM", label: "Minimum elevation m", kind: "number" },
  { id: "maximumElevationM", label: "Maximum elevation m", kind: "number" },
  { id: "bands", label: "Bands", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  range([i.minimumElevationM, i.maximumElevationM], "extent");
  bounded(i.bands, "bands", 1, 128);
  return {
    elevationBreaksM: Array.from(
      { length: i.bands + 1 },
      (_, j) =>
        i.minimumElevationM +
        ((i.maximumElevationM - i.minimumElevationM) * j) / i.bands,
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { minimumElevationM: 0, maximumElevationM: 1000, bands: 4 },
  output: { result: { elevationBreaksM: [0, 250, 500, 750, 1000] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/hypsometric-tint-break-generator",
  title: "Hypsometric Tint Break Value Spacing Generator",
  description:
    "Generate equal elevation tint-band endpoints; no color palette or topographic accuracy inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elevationBreaksM: { type: "array", items: { type: "number" } },
        },
        required: ["elevationBreaksM"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

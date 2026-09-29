import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftStation: number;
  readonly rightStation: number;
  readonly depth: number;
};
export type Output = { readonly areaContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftStation: { type: "number" },
    rightStation: { type: "number" },
    depth: { type: "number", minimum: 0 },
  },
  required: ["leftStation", "rightStation", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaContribution: { type: "number" } },
  required: ["areaContribution"],
} as const;
/** Use half the span between adjacent bounding verticals as one midsection width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftStation, rightStation, depth } = request;
  const compute = (): Output => {
    H.domain(rightStation >= leftStation && depth >= 0);
    return { areaContribution: ((rightStation - leftStation) * depth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftStation: 2, rightStation: 6, depth: 3 },
  output: { areaContribution: 6 },
} satisfies ToolExample<Input, Output>;
export const gaugingVerticalMidsectionAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/gauging-vertical-midsection-area-term",
    title: "Gauging Vertical Midsection Area Term Tool",
    description:
      "Use half the span between adjacent bounding verticals as one midsection width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftStation: { type: "number" },
        rightStation: { type: "number" },
        depth: { type: "number", minimum: 0 },
      },
      required: ["leftStation", "rightStation", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { areaContribution: { type: "number" } },
      required: ["areaContribution"],
    },
    ports: {
      inputs: [
        {
          id: "leftStation",
          label: "Left Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightStation",
          label: "Right Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaContribution",
          label: "Area Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugingVerticalMidsectionAreaTermTool.execute;
export default gaugingVerticalMidsectionAreaTermTool;

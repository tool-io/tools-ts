import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = { readonly signedAreaContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedAreaContribution: { type: "number" } },
  required: ["signedAreaContribution"],
} as const;
/** Return one directed edge’s shoelace signed-area contribution without validating or summing a polygon. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    return {
      signedAreaContribution: (firstX * secondY - secondX * firstY) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 2, firstY: 1, secondX: 3, secondY: 4 },
  output: { signedAreaContribution: 2.5 },
} satisfies ToolExample<Input, Output>;
export const polygonSignedAreaEdgeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/polygon-signed-area-edge-term",
    title: "Polygon Signed Area Edge Term Tool",
    description:
      "Return one directed edge’s shoelace signed-area contribution without validating or summing a polygon.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
      },
      required: ["firstX", "firstY", "secondX", "secondY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedAreaContribution: { type: "number" } },
      required: ["signedAreaContribution"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedAreaContribution",
          label: "Signed Area Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polygonSignedAreaEdgeTermTool.execute;
export default polygonSignedAreaEdgeTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly neighborhoodId: string;
  readonly boundarySource: string;
  readonly vintageText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neighborhoodId: { type: "string", maxLength: 8192, minLength: 1 },
    boundarySource: { type: "string", maxLength: 8192, minLength: 1 },
    vintageText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["neighborhoodId", "boundarySource", "vintageText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit neighborhood boundary source and vintage metadata without harmonizing spatial units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { neighborhoodId, boundarySource, vintageText } = request;
  const compute = (): Output => {
    H.domain(neighborhoodId.length > 0, "neighborhoodId");
    H.domain(boundarySource.length > 0, "boundarySource");
    H.domain(vintageText.length > 0, "vintageText");
    return {
      token: JSON.stringify([neighborhoodId, boundarySource, vintageText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    neighborhoodId: "N17",
    boundarySource: "map M4",
    vintageText: "2020 boundaries",
  },
  output: { token: '["N17","map M4","2020 boundaries"]' },
} satisfies ToolExample<Input, Output>;
export const neighborhoodBoundaryVintageTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/neighborhood-boundary-vintage-tag",
    title: "Neighborhood Boundary Vintage Tag Tool",
    description:
      "Preserve explicit neighborhood boundary source and vintage metadata without harmonizing spatial units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neighborhoodId: { type: "string", maxLength: 8192, minLength: 1 },
        boundarySource: { type: "string", maxLength: 8192, minLength: 1 },
        vintageText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["neighborhoodId", "boundarySource", "vintageText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "neighborhoodId",
          label: "Neighborhood Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundarySource",
          label: "Boundary Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vintageText",
          label: "Vintage Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = neighborhoodBoundaryVintageTagTool.execute;
export default neighborhoodBoundaryVintageTagTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly origin: number;
  readonly span: number;
  readonly secondThird: boolean;
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    origin: { type: "number" },
    span: { type: "number" },
    secondThird: { type: "boolean" },
  },
  required: ["origin", "span", "secondThird"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** Locate the first or second third-line coordinate on an explicit oriented span without judging composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { origin, span, secondThird } = request;
  const compute = (): Output => {
    return { coordinate: origin + span * (secondThird ? 2 / 3 : 1 / 3) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { origin: 10, span: 90, secondThird: false },
  output: { coordinate: 40 },
} satisfies ToolExample<Input, Output>;
export const compositionGridThirdLineCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/composition-grid-third-line-coordinate",
    title: "Composition Grid Third Line Coordinate",
    description:
      "Locate the first or second third-line coordinate on an explicit oriented span without judging composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        origin: { type: "number" },
        span: { type: "number" },
        secondThird: { type: "boolean" },
      },
      required: ["origin", "span", "secondThird"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coordinate: { type: "number" } },
      required: ["coordinate"],
    },
    ports: {
      inputs: [
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondThird",
          label: "Second Third",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compositionGridThirdLineCoordinateTool.execute;
export default compositionGridThirdLineCoordinateTool;

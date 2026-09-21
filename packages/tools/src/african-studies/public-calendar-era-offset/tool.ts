import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearCoordinate: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly mappedCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearCoordinate: { type: "number" },
    suppliedOffset: { type: "number" },
  },
  required: ["yearCoordinate", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mappedCoordinate: { type: "number" } },
  required: ["mappedCoordinate"],
} as const;
/** Apply a caller-supplied affine offset to public calendar coordinates; no historical conversion table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearCoordinate, suppliedOffset } = request;
  const compute = (): Output => {
    return { mappedCoordinate: yearCoordinate + suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yearCoordinate: 1400, suppliedOffset: 600 },
  output: { mappedCoordinate: 2000 },
} satisfies ToolExample<Input, Output>;
export const publicCalendarEraOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/public-calendar-era-offset",
    title: "Public Calendar Era Offset Tool",
    description:
      "Apply a caller-supplied affine offset to public calendar coordinates; no historical conversion table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearCoordinate: { type: "number" },
        suppliedOffset: { type: "number" },
      },
      required: ["yearCoordinate", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mappedCoordinate: { type: "number" } },
      required: ["mappedCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "yearCoordinate",
          label: "Year Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mappedCoordinate",
          label: "Mapped Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCalendarEraOffsetTool.execute;
export default publicCalendarEraOffsetTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly spacing: number;
  readonly ties: string;
};
export type Output = { readonly index: number; readonly snapped: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    spacing: { type: "number", exclusiveMinimum: 0 },
    ties: { type: "string", maxLength: 8192, enum: ["lower", "upper"] },
  },
  required: ["coordinate", "origin", "spacing", "ties"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" }, snapped: { type: "number" } },
  required: ["index", "snapped"],
} as const;
/** Snap a supplied coordinate to an origin-relative grid with an explicit half-step side. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, spacing, ties } = request;
  const compute = (): Output => {
    H.positive(spacing);
    H.domain(["lower", "upper"].includes(ties));
    const q = (coordinate - origin) / spacing,
      lo = Math.floor(q),
      index =
        q - lo < 0.5 || (q - lo === 0.5 && ties === "lower") ? lo : lo + 1;
    return { index, snapped: origin + index * spacing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 5, origin: 0, spacing: 2, ties: "lower" },
  output: { index: 2, snapped: 4 },
} satisfies ToolExample<Input, Output>;
export const muralGridOriginSnapTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/mural-grid-origin-snap-token",
    title: "Mural Grid Origin Snap Token Tool",
    description:
      "Snap a supplied coordinate to an origin-relative grid with an explicit half-step side.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        spacing: { type: "number", exclusiveMinimum: 0 },
        ties: { type: "string", maxLength: 8192, enum: ["lower", "upper"] },
      },
      required: ["coordinate", "origin", "spacing", "ties"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" }, snapped: { type: "number" } },
      required: ["index", "snapped"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ties",
          label: "Ties",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "snapped", label: "Snapped", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = muralGridOriginSnapTokenTool.execute;
export default muralGridOriginSnapTokenTool;

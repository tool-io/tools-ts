import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly length: number;
};
export type Output = { readonly coordinate: number; readonly image: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    length: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "origin", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" }, image: { type: "integer" } },
  required: ["coordinate", "image"],
} as const;
/** Calculate periodic box wrap one axis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, length } = request;
  const compute = (): Output => {
    H.positive(length);
    const image = Math.floor((coordinate - origin) / length);
    return { coordinate: origin + H.mod(coordinate - origin, length), image };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: -2, origin: 0, length: 10 },
  output: { coordinate: 8, image: -1 },
} satisfies ToolExample<Input, Output>;
export const periodicBoxWrapOneAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/periodic-box-wrap-one-axis",
    title: "Periodic Box Wrap One Axis Tool",
    description:
      "Calculate periodic box wrap one axis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        length: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "origin", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        image: { type: "integer" },
      },
      required: ["coordinate", "image"],
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
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "number" },
        },
        { id: "image", label: "Image", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = periodicBoxWrapOneAxisTool.execute;
export default periodicBoxWrapOneAxisTool;

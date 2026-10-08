import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly axialOrientation: boolean;
};
export type Output = { readonly wrappedDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    axialOrientation: { type: "boolean" },
  },
  required: ["angleDegrees", "axialOrientation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrappedDegrees: { type: "number" } },
  required: ["wrappedDegrees"],
} as const;
/** Wrap an explicit division-orientation angle under a caller-selected axial 180° or directed 360° convention without inferring polarity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, axialOrientation } = request;
  const compute = (): Output => {
    const period = axialOrientation ? 180 : 360,
      r = angleDegrees % period;
    return { wrappedDegrees: r < 0 ? r + period : r };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: -10, axialOrientation: true },
  output: { wrappedDegrees: 170 },
} satisfies ToolExample<Input, Output>;
export const cellDivisionAngleWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/cell-division-angle-wrap",
    title: "Cell Division Angle Wrap",
    description:
      "Wrap an explicit division-orientation angle under a caller-selected axial 180° or directed 360° convention without inferring polarity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        axialOrientation: { type: "boolean" },
      },
      required: ["angleDegrees", "axialOrientation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wrappedDegrees: { type: "number" } },
      required: ["wrappedDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axialOrientation",
          label: "Axial Orientation",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "wrappedDegrees",
          label: "Wrapped Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellDivisionAngleWrapTool.execute;
export default cellDivisionAngleWrapTool;

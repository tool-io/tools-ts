import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headingDegrees: number;
  readonly suppliedDeclinationDegrees: number;
};
export type Output = { readonly correctedDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headingDegrees: { type: "number" },
    suppliedDeclinationDegrees: { type: "number" },
  },
  required: ["headingDegrees", "suppliedDeclinationDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedDegrees: { type: "number" } },
  required: ["correctedDegrees"],
} as const;
/** Apply an explicit signed heading correction and wrap to [0,360), without a magnetic-field model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headingDegrees, suppliedDeclinationDegrees } = request;
  const compute = (): Output => {
    const positiveRemainder = (x: number, n: number): number => {
      const r = x % n;
      if (r >= 0) return r;
      const v = r + n;
      return v === n ? 0 : v;
    };
    return {
      correctedDegrees: positiveRemainder(
        (headingDegrees % 360) + (suppliedDeclinationDegrees % 360),
        360,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headingDegrees: 350, suppliedDeclinationDegrees: 20 },
  output: { correctedDegrees: 10 },
} satisfies ToolExample<Input, Output>;
export const magneticHeadingReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/magnetic-heading-reference-offset",
    title: "Magnetic Heading Reference Offset Tool",
    description:
      "Apply an explicit signed heading correction and wrap to [0,360), without a magnetic-field model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headingDegrees: { type: "number" },
        suppliedDeclinationDegrees: { type: "number" },
      },
      required: ["headingDegrees", "suppliedDeclinationDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedDegrees: { type: "number" } },
      required: ["correctedDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "headingDegrees",
          label: "Heading Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeclinationDegrees",
          label: "Supplied Declination Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDegrees",
          label: "Corrected Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = magneticHeadingReferenceOffsetTool.execute;
export default magneticHeadingReferenceOffsetTool;

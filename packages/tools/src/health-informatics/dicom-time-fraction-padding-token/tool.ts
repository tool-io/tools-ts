import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly time: string };
export type Output = {
  readonly padded: string;
  readonly fractionalDigits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { time: { type: "string", maxLength: 8192 } },
  required: ["time"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    padded: { type: "string", maxLength: 8192 },
    fractionalDigits: { type: "integer" },
  },
  required: ["padded", "fractionalDigits"],
} as const;
/** Pad the fraction of a full HHMMSS DICOM TM token to six digits; partial-hour/minute tokens are outside this operation and a declared leap-second value 60 is retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time } = request;
  const compute = (): Output => {
    const match =
      /^([01]\d|2[0-3])([0-5]\d)([0-5]\d|60)(?:\.(\d{1,6}))?(?![\s\S])/.exec(
        time,
      );
    H.domain(match, "time");
    const fraction = match[4] ?? "";
    return {
      padded: match[1] + match[2] + match[3] + "." + fraction.padEnd(6, "0"),
      fractionalDigits: fraction.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: "123456.12" },
  output: { padded: "123456.120000", fractionalDigits: 2 },
} satisfies ToolExample<Input, Output>;
export const dicomTimeFractionPaddingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/dicom-time-fraction-padding-token",
    title: "DICOM Time Fraction Padding Token Tool",
    description:
      "Pad the fraction of a full HHMMSS DICOM TM token to six digits; partial-hour/minute tokens are outside this operation and a declared leap-second value 60 is retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { time: { type: "string", maxLength: 8192 } },
      required: ["time"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        padded: { type: "string", maxLength: 8192 },
        fractionalDigits: { type: "integer" },
      },
      required: ["padded", "fractionalDigits"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "padded", label: "Padded", valueType: { type: "string" } },
        {
          id: "fractionalDigits",
          label: "Fractional Digits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomTimeFractionPaddingTokenTool.execute;
export default dicomTimeFractionPaddingTokenTool;

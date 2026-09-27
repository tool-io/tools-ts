import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly degrees: string;
  readonly minutes: string;
  readonly seconds: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degrees: { type: "string", maxLength: 8192 },
    minutes: { type: "string", maxLength: 8192 },
    seconds: { type: "string", maxLength: 8192 },
  },
  required: ["degrees", "minutes", "seconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Join validated numeric degree, minute and second tokens using typographic prime symbols. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { degrees, minutes, seconds } = input;
  const compute = (): Output => {
    H.domain(
      /^-?\d+(?![\s\S])/.test(degrees) &&
        /^\d+(?![\s\S])/.test(minutes) &&
        /^\d+(?:\.\d+)?(?![\s\S])/.test(seconds),
    );
    return { text: degrees + "° " + minutes + "′ " + seconds + "″" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degrees: "12", minutes: "03", seconds: "4.5" },
  output: { text: "12° 03′ 4.5″" },
} satisfies ToolExample<Input, Output>;
export const degreeMinutePrimeSymbolJoinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/degree-minute-prime-symbol-join",
    title: "Degree Minute Prime Symbol Join Tool",
    description:
      "Join validated numeric degree, minute and second tokens using typographic prime symbols.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degrees: { type: "string", maxLength: 8192 },
        minutes: { type: "string", maxLength: 8192 },
        seconds: { type: "string", maxLength: 8192 },
      },
      required: ["degrees", "minutes", "seconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "degrees",
          label: "Degrees",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "minutes",
          label: "Minutes",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seconds",
          label: "Seconds",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = degreeMinutePrimeSymbolJoinTool.execute;
export default degreeMinutePrimeSymbolJoinTool;

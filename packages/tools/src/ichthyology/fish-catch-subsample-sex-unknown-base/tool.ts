import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSex: number;
  readonly secondSex: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly firstSexFraction: number;
  readonly unknownFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSex: { type: "integer", minimum: 0 },
    secondSex: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["firstSex", "secondSex", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    firstSexFraction: { type: "number" },
    unknownFraction: { type: "number" },
  },
  required: ["denominator", "firstSexFraction", "unknownFraction"],
} as const;
/** Calculate fish catch subsample sex unknown base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSex, secondSex, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(firstSex, 0);
    H.integer(secondSex, 0);
    H.integer(unknown, 0);
    H.domain(firstSex + secondSex > 0);
    return {
      denominator: firstSex + secondSex + (includeUnknown ? unknown : 0),
      firstSexFraction:
        firstSex / (firstSex + secondSex + (includeUnknown ? unknown : 0)),
      unknownFraction: unknown / (firstSex + secondSex + unknown),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSex: 30, secondSex: 20, unknown: 10, includeUnknown: false },
  output: {
    denominator: 50,
    firstSexFraction: 0.6,
    unknownFraction: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const fishCatchSubsampleSexUnknownBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-catch-subsample-sex-unknown-base",
    title: "Fish Catch Subsample Sex Unknown Base Tool",
    description:
      "Calculate fish catch subsample sex unknown base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSex: { type: "integer", minimum: 0 },
        secondSex: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["firstSex", "secondSex", "unknown", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        firstSexFraction: { type: "number" },
        unknownFraction: { type: "number" },
      },
      required: ["denominator", "firstSexFraction", "unknownFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstSex",
          label: "First Sex",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSex",
          label: "Second Sex",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "firstSexFraction",
          label: "First Sex Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unknownFraction",
          label: "Unknown Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishCatchSubsampleSexUnknownBaseTool.execute;
export default fishCatchSubsampleSexUnknownBaseTool;

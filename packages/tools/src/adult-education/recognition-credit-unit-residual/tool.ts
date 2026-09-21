import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recognizedSourceCredits: readonly number[];
  readonly sourceToTargetFactors: readonly number[];
  readonly awardedTargetCredits: number;
};
export type Output = {
  readonly convertedCredits: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedSourceCredits: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    sourceToTargetFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    awardedTargetCredits: { type: "number", minimum: 0 },
  },
  required: [
    "recognizedSourceCredits",
    "sourceToTargetFactors",
    "awardedTargetCredits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedCredits: { type: "number" },
    residual: { type: "number" },
  },
  required: ["convertedCredits", "residual"],
} as const;
/** Calculate recognition credit unit residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recognizedSourceCredits,
    sourceToTargetFactors,
    awardedTargetCredits,
  } = request;
  const compute = (): Output => {
    H.sameLength(recognizedSourceCredits, sourceToTargetFactors);
    H.domain(
      recognizedSourceCredits.every((x) => x >= 0) &&
        sourceToTargetFactors.every((x) => x > 0) &&
        awardedTargetCredits >= 0,
    );
    return (() => {
      const convertedCredits = recognizedSourceCredits.reduce(
        (s, x, i) => s + x * sourceToTargetFactors[i],
        0,
      );
      return {
        convertedCredits,
        residual: awardedTargetCredits - convertedCredits,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recognizedSourceCredits: [2, 3],
    sourceToTargetFactors: [1, 2],
    awardedTargetCredits: 7,
  },
  output: { convertedCredits: 8, residual: -1 },
} satisfies ToolExample<Input, Output>;
export const recognitionCreditUnitResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/recognition-credit-unit-residual",
    title: "Recognition Credit Unit Residual Tool",
    description:
      "Calculate recognition credit unit residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognizedSourceCredits: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        sourceToTargetFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        awardedTargetCredits: { type: "number", minimum: 0 },
      },
      required: [
        "recognizedSourceCredits",
        "sourceToTargetFactors",
        "awardedTargetCredits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedCredits: { type: "number" },
        residual: { type: "number" },
      },
      required: ["convertedCredits", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "recognizedSourceCredits",
          label: "Recognized Source Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceToTargetFactors",
          label: "Source To Target Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "awardedTargetCredits",
          label: "Awarded Target Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedCredits",
          label: "Converted Credits",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recognitionCreditUnitResidualTool.execute;
export default recognitionCreditUnitResidualTool;

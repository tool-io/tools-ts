import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reflectionCoefficient: number;
  readonly displayPositiveForCompression: boolean;
  readonly instrumentSign: number;
};
export type Output = {
  readonly displayCoefficient: number;
  readonly polarity: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectionCoefficient: { type: "number" },
    displayPositiveForCompression: { type: "boolean" },
    instrumentSign: { type: "integer" },
  },
  required: [
    "reflectionCoefficient",
    "displayPositiveForCompression",
    "instrumentSign",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayCoefficient: { type: "number" },
    polarity: { type: "string", maxLength: 8192 },
  },
  required: ["displayCoefficient", "polarity"],
} as const;
/** Explicit coefficient sign transformation, without assuming an SEG display or wavelet convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reflectionCoefficient,
    displayPositiveForCompression,
    instrumentSign,
  } = request;
  const compute = (): Output => {
    H.domain(
      reflectionCoefficient >= -1 &&
        reflectionCoefficient <= 1 &&
        (instrumentSign === 1 || instrumentSign === -1),
    );
    return {
      displayCoefficient:
        reflectionCoefficient *
        instrumentSign *
        (displayPositiveForCompression ? 1 : -1),
      polarity:
        reflectionCoefficient === 0
          ? "zero"
          : reflectionCoefficient *
                instrumentSign *
                (displayPositiveForCompression ? 1 : -1) >
              0
            ? "positive"
            : "negative",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reflectionCoefficient: 0.2,
    displayPositiveForCompression: true,
    instrumentSign: 1,
  },
  output: { displayCoefficient: 0.2, polarity: "positive" },
} satisfies ToolExample<Input, Output>;
export const seismicPolarityConventionReflectionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/seismic-polarity-convention-reflection-tag",
      title: "Seismic Polarity Convention Reflection Tag Tool",
      description:
        "Explicit coefficient sign transformation, without assuming an SEG display or wavelet convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflectionCoefficient: { type: "number" },
          displayPositiveForCompression: { type: "boolean" },
          instrumentSign: { type: "integer" },
        },
        required: [
          "reflectionCoefficient",
          "displayPositiveForCompression",
          "instrumentSign",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          displayCoefficient: { type: "number" },
          polarity: { type: "string", maxLength: 8192 },
        },
        required: ["displayCoefficient", "polarity"],
      },
      ports: {
        inputs: [
          {
            id: "reflectionCoefficient",
            label: "Reflection Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displayPositiveForCompression",
            label: "Display Positive For Compression",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "instrumentSign",
            label: "Instrument Sign",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "displayCoefficient",
            label: "Display Coefficient",
            valueType: { type: "number" },
          },
          { id: "polarity", label: "Polarity", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = seismicPolarityConventionReflectionTagTool.execute;
export default seismicPolarityConventionReflectionTagTool;

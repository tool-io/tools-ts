import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResponse: number;
  readonly firstBackground: number;
  readonly secondResponse: number;
  readonly secondBackground: number;
};
export type Output = {
  readonly firstCorrected: number;
  readonly secondCorrected: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResponse: { type: "number" },
    firstBackground: { type: "number" },
    secondResponse: { type: "number" },
    secondBackground: { type: "number" },
  },
  required: [
    "firstResponse",
    "firstBackground",
    "secondResponse",
    "secondBackground",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCorrected: { type: "number" },
    secondCorrected: { type: "number" },
    difference: { type: "number" },
  },
  required: ["firstCorrected", "secondCorrected", "difference"],
} as const;
/** Compare supplied research assay background corrections without immune status or clinical response interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstResponse, firstBackground, secondResponse, secondBackground } =
    request;
  const compute = (): Output => {
    return {
      firstCorrected: firstResponse - firstBackground,
      secondCorrected: secondResponse - secondBackground,
      difference:
        secondResponse - secondBackground - firstResponse + firstBackground,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstResponse: 10,
    firstBackground: 2,
    secondResponse: 12,
    secondBackground: 1,
  },
  output: { firstCorrected: 8, secondCorrected: 11, difference: 3 },
} satisfies ToolExample<Input, Output>;
export const assayBackgroundResponseDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/assay-background-response-difference",
    title: "Assay Background Response Difference Tool",
    description:
      "Compare supplied research assay background corrections without immune status or clinical response interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstResponse: { type: "number" },
        firstBackground: { type: "number" },
        secondResponse: { type: "number" },
        secondBackground: { type: "number" },
      },
      required: [
        "firstResponse",
        "firstBackground",
        "secondResponse",
        "secondBackground",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCorrected: { type: "number" },
        secondCorrected: { type: "number" },
        difference: { type: "number" },
      },
      required: ["firstCorrected", "secondCorrected", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "firstResponse",
          label: "First Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBackground",
          label: "First Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondResponse",
          label: "Second Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBackground",
          label: "Second Background",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstCorrected",
          label: "First Corrected",
          valueType: { type: "number" },
        },
        {
          id: "secondCorrected",
          label: "Second Corrected",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayBackgroundResponseDifferenceTool.execute;
export default assayBackgroundResponseDifferenceTool;

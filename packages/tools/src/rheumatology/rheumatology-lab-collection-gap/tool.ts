import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCollectionSeconds: number;
  readonly secondCollectionSeconds: number;
};
export type Output = { readonly signedGapSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCollectionSeconds: { type: "number" },
    secondCollectionSeconds: { type: "number" },
  },
  required: ["firstCollectionSeconds", "secondCollectionSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGapSeconds: { type: "number" } },
  required: ["signedGapSeconds"],
} as const;
/** Compare explicit laboratory collection timestamps on a common time axis without determining a testing interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCollectionSeconds, secondCollectionSeconds } = request;
  const compute = (): Output => {
    return {
      signedGapSeconds: secondCollectionSeconds - firstCollectionSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCollectionSeconds: 100, secondCollectionSeconds: 400 },
  output: { signedGapSeconds: 300 },
} satisfies ToolExample<Input, Output>;
export const rheumatologyLabCollectionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/rheumatology-lab-collection-gap",
    title: "Rheumatology Lab Collection Gap",
    description:
      "Compare explicit laboratory collection timestamps on a common time axis without determining a testing interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCollectionSeconds: { type: "number" },
        secondCollectionSeconds: { type: "number" },
      },
      required: ["firstCollectionSeconds", "secondCollectionSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGapSeconds: { type: "number" } },
      required: ["signedGapSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstCollectionSeconds",
          label: "First Collection Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCollectionSeconds",
          label: "Second Collection Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGapSeconds",
          label: "Signed Gap Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rheumatologyLabCollectionGapTool.execute;
export default rheumatologyLabCollectionGapTool;

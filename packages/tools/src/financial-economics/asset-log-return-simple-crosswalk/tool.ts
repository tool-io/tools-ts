import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly simpleReturn: number };
export type Output = {
  readonly logReturn: number;
  readonly wealthFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { simpleReturn: { type: "number", exclusiveMinimum: -1 } },
  required: ["simpleReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logReturn: { type: "number" },
    wealthFactor: { type: "number" },
  },
  required: ["logReturn", "wealthFactor"],
} as const;
/** Calculate asset log return simple crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { simpleReturn } = request;
  const compute = (): Output => {
    H.domain(simpleReturn > -1);
    return {
      logReturn: Math.log1p(simpleReturn),
      wealthFactor: 1 + simpleReturn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { simpleReturn: 0.1 },
  output: { logReturn: 0.09531017980432487, wealthFactor: 1.1 },
} satisfies ToolExample<Input, Output>;
export const assetLogReturnSimpleCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/asset-log-return-simple-crosswalk",
    title: "Asset Log Return Simple Crosswalk Tool",
    description:
      "Calculate asset log return simple crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { simpleReturn: { type: "number", exclusiveMinimum: -1 } },
      required: ["simpleReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logReturn: { type: "number" },
        wealthFactor: { type: "number" },
      },
      required: ["logReturn", "wealthFactor"],
    },
    ports: {
      inputs: [
        {
          id: "simpleReturn",
          label: "Simple Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logReturn", label: "Log Return", valueType: { type: "number" } },
        {
          id: "wealthFactor",
          label: "Wealth Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assetLogReturnSimpleCrosswalkTool.execute;
export default assetLogReturnSimpleCrosswalkTool;

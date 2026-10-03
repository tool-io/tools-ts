import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly correlation: number };
export type Output = {
  readonly defined: boolean;
  readonly boundaryGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correlation: { type: "number", minimum: -1, maximum: 1 } },
  required: ["correlation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, boundaryGap: { type: "number" } },
  required: ["defined", "boundaryGap"],
} as const;
/** Calculate fisher z correlation domain gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correlation } = request;
  const compute = (): Output => {
    H.domain(correlation >= -1 && correlation <= 1);
    return {
      defined: Math.abs(correlation) < 1,
      boundaryGap: 1 - Math.abs(correlation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correlation: 0.75 },
  output: { defined: true, boundaryGap: 0.25 },
} satisfies ToolExample<Input, Output>;
export const fisherZCorrelationDomainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/fisher-z-correlation-domain-gap",
    title: "Fisher Z Correlation Domain Gap Tool",
    description:
      "Calculate fisher z correlation domain gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correlation: { type: "number", minimum: -1, maximum: 1 } },
      required: ["correlation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        boundaryGap: { type: "number" },
      },
      required: ["defined", "boundaryGap"],
    },
    ports: {
      inputs: [
        {
          id: "correlation",
          label: "Correlation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "boundaryGap",
          label: "Boundary Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fisherZCorrelationDomainGapTool.execute;
export default fisherZCorrelationDomainGapTool;

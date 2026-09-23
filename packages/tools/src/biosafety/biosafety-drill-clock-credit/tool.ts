import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly interruption: number;
  readonly creditedFraction: number;
};
export type Output = { readonly credit: number; readonly netDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    interruption: { type: "number", minimum: 0 },
    creditedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["elapsed", "interruption", "creditedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "number" }, netDuration: { type: "number" } },
  required: ["credit", "netDuration"],
} as const;
/** Administrative drill-time accounting using supplied interruption credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, interruption, creditedFraction } = request;
  const compute = (): Output => {
    H.probability(creditedFraction);
    H.domain(elapsed >= 0 && interruption >= 0 && interruption <= elapsed);
    return {
      credit: interruption * creditedFraction,
      netDuration: elapsed - interruption * creditedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 60, interruption: 10, creditedFraction: 0.5 },
  output: { credit: 5, netDuration: 55 },
} satisfies ToolExample<Input, Output>;
export const biosafetyDrillClockCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-drill-clock-credit",
    title: "Biosafety Drill Clock Credit Tool",
    description:
      "Administrative drill-time accounting using supplied interruption credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        interruption: { type: "number", minimum: 0 },
        creditedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["elapsed", "interruption", "creditedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credit: { type: "number" },
        netDuration: { type: "number" },
      },
      required: ["credit", "netDuration"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interruption",
          label: "Interruption",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedFraction",
          label: "Credited Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "number" } },
        {
          id: "netDuration",
          label: "Net Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyDrillClockCreditTool.execute;
export default biosafetyDrillClockCreditTool;

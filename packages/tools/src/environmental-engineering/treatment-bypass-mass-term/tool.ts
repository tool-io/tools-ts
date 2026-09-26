import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bypassFlow: number;
  readonly untreatedConcentration: number;
  readonly duration: number;
};
export type Output = { readonly bypassMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bypassFlow: { type: "number", minimum: 0 },
    untreatedConcentration: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["bypassFlow", "untreatedConcentration", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bypassMass: { type: "number" } },
  required: ["bypassMass"],
} as const;
/** Integrate a constant explicitly supplied bypass stream load in compatible units without regulatory interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bypassFlow, untreatedConcentration, duration } = request;
  const compute = (): Output => {
    H.domain(bypassFlow >= 0 && untreatedConcentration >= 0 && duration >= 0);
    return { bypassMass: bypassFlow * untreatedConcentration * duration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bypassFlow: 2, untreatedConcentration: 3, duration: 4 },
  output: { bypassMass: 24 },
} satisfies ToolExample<Input, Output>;
export const treatmentBypassMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/treatment-bypass-mass-term",
    title: "Treatment Bypass Mass Term Tool",
    description:
      "Integrate a constant explicitly supplied bypass stream load in compatible units without regulatory interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bypassFlow: { type: "number", minimum: 0 },
        untreatedConcentration: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["bypassFlow", "untreatedConcentration", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bypassMass: { type: "number" } },
      required: ["bypassMass"],
    },
    ports: {
      inputs: [
        {
          id: "bypassFlow",
          label: "Bypass Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "untreatedConcentration",
          label: "Untreated Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bypassMass",
          label: "Bypass Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatmentBypassMassTermTool.execute;
export default treatmentBypassMassTermTool;

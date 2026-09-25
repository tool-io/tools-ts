import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = {
  readonly saturated: number;
  readonly dutyFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["requested", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturated: { type: "number" },
    dutyFraction: { type: "number" },
  },
  required: ["saturated", "dutyFraction"],
} as const;
/** Calculate control saturation duty fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(maximum > minimum);
    return {
      saturated: Math.max(minimum, Math.min(maximum, requested)),
      dutyFraction:
        (Math.max(minimum, Math.min(maximum, requested)) - minimum) /
        (maximum - minimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requested: 15, minimum: 0, maximum: 10 },
  output: { saturated: 10, dutyFraction: 1 },
} satisfies ToolExample<Input, Output>;
export const controlSaturationDutyFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/control-saturation-duty-fraction-term",
    title: "Control Saturation Duty Fraction Term Tool",
    description:
      "Calculate control saturation duty fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requested: { type: "number" },
        minimum: { type: "number" },
        maximum: { type: "number" },
      },
      required: ["requested", "minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saturated: { type: "number" },
        dutyFraction: { type: "number" },
      },
      required: ["saturated", "dutyFraction"],
    },
    ports: {
      inputs: [
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "saturated", label: "Saturated", valueType: { type: "number" } },
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = controlSaturationDutyFractionTermTool.execute;
export default controlSaturationDutyFractionTermTool;

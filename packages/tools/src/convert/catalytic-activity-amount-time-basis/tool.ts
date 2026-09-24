import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly micromolesPerMinute: number };
export type Output = { readonly katals: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { micromolesPerMinute: { type: "number" } },
  required: ["micromolesPerMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { katals: { type: "number" } },
  required: ["katals"],
} as const;
/** Calculate catalytic activity amount time basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { micromolesPerMinute } = request;
  const compute = (): Output => {
    return { katals: micromolesPerMinute / 60000000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { micromolesPerMinute: 60 },
  output: { katals: 0.000001 },
} satisfies ToolExample<Input, Output>;
export const catalyticActivityAmountTimeBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/catalytic-activity-amount-time-basis",
    title: "Catalytic Activity Amount Time Basis Tool",
    description:
      "Calculate catalytic activity amount time basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { micromolesPerMinute: { type: "number" } },
      required: ["micromolesPerMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { katals: { type: "number" } },
      required: ["katals"],
    },
    ports: {
      inputs: [
        {
          id: "micromolesPerMinute",
          label: "Micromoles Per Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "katals", label: "Katals", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = catalyticActivityAmountTimeBasisTool.execute;
export default catalyticActivityAmountTimeBasisTool;

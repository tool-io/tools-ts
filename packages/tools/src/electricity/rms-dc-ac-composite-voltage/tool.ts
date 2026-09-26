import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dc: number; readonly acRms: number };
export type Output = { readonly totalRms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dc: { type: "number" }, acRms: { type: "number", minimum: 0 } },
  required: ["dc", "acRms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalRms: { type: "number" } },
  required: ["totalRms"],
} as const;
/** Calculate rms dc ac composite voltage from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dc, acRms } = request;
  const compute = (): Output => {
    H.domain(acRms >= 0);
    return { totalRms: Math.hypot(dc, acRms) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dc: 3, acRms: 4 },
  output: { totalRms: 5 },
} satisfies ToolExample<Input, Output>;
export const rmsDcAcCompositeVoltageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/rms-dc-ac-composite-voltage",
    title: "RMS DC AC Composite Voltage Tool",
    description:
      "Calculate rms dc ac composite voltage from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dc: { type: "number" },
        acRms: { type: "number", minimum: 0 },
      },
      required: ["dc", "acRms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalRms: { type: "number" } },
      required: ["totalRms"],
    },
    ports: {
      inputs: [
        {
          id: "dc",
          label: "Dc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acRms",
          label: "Ac Rms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalRms", label: "Total Rms", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rmsDcAcCompositeVoltageTool.execute;
export default rmsDcAcCompositeVoltageTool;

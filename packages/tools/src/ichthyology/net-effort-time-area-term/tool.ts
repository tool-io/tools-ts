import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netArea: number;
  readonly hours: number;
  readonly functioningFraction: number;
};
export type Output = { readonly areaHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netArea: { type: "number", minimum: 0 },
    hours: { type: "number", minimum: 0 },
    functioningFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["netArea", "hours", "functioningFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaHours: { type: "number" } },
  required: ["areaHours"],
} as const;
/** Calculate net effort time area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { netArea, hours, functioningFraction } = request;
  const compute = (): Output => {
    H.domain(netArea >= 0 && hours >= 0);
    H.probability(functioningFraction);
    return { areaHours: netArea * hours * functioningFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { netArea: 10, hours: 3, functioningFraction: 0.8 },
  output: { areaHours: 24 },
} satisfies ToolExample<Input, Output>;
export const netEffortTimeAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/net-effort-time-area-term",
    title: "Net Effort Time Area Term Tool",
    description:
      "Calculate net effort time area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netArea: { type: "number", minimum: 0 },
        hours: { type: "number", minimum: 0 },
        functioningFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["netArea", "hours", "functioningFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { areaHours: { type: "number" } },
      required: ["areaHours"],
    },
    ports: {
      inputs: [
        {
          id: "netArea",
          label: "Net Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "functioningFraction",
          label: "Functioning Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaHours", label: "Area Hours", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = netEffortTimeAreaTermTool.execute;
export default netEffortTimeAreaTermTool;

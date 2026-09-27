import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly used: number;
  readonly renewed: number;
  readonly reserve: number;
};
export type Output = {
  readonly closing: number;
  readonly reserveMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    used: { type: "number", minimum: 0 },
    renewed: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
  },
  required: ["opening", "used", "renewed", "reserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closing: { type: "number" },
    reserveMargin: { type: "number" },
  },
  required: ["closing", "reserveMargin"],
} as const;
/** Calculate stewardship resource renewal balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, used, renewed, reserve } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        used >= 0 &&
        renewed >= 0 &&
        reserve >= 0 &&
        used <= opening,
    );
    return {
      closing: opening - used + renewed,
      reserveMargin: opening - used + renewed - reserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 100, used: 30, renewed: 20, reserve: 80 },
  output: { closing: 90, reserveMargin: 10 },
} satisfies ToolExample<Input, Output>;
export const stewardshipResourceRenewalBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/stewardship-resource-renewal-balance",
    title: "Stewardship Resource Renewal Balance Tool",
    description:
      "Calculate stewardship resource renewal balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "number", minimum: 0 },
        used: { type: "number", minimum: 0 },
        renewed: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
      },
      required: ["opening", "used", "renewed", "reserve"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closing: { type: "number" },
        reserveMargin: { type: "number" },
      },
      required: ["closing", "reserveMargin"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "renewed",
          label: "Renewed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "closing", label: "Closing", valueType: { type: "number" } },
        {
          id: "reserveMargin",
          label: "Reserve Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stewardshipResourceRenewalBalanceTool.execute;
export default stewardshipResourceRenewalBalanceTool;

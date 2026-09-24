import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossInstalled: number;
  readonly rework: number;
  readonly credited: number;
};
export type Output = { readonly netInstalled: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossInstalled: { type: "number", minimum: 0 },
    rework: { type: "number", minimum: 0 },
    credited: { type: "number", minimum: 0 },
  },
  required: ["grossInstalled", "rework", "credited"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netInstalled: { type: "number" }, gap: { type: "number" } },
  required: ["netInstalled", "gap"],
} as const;
/** Calculate rework quantity credit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossInstalled, rework, credited } = request;
  const compute = (): Output => {
    H.domain(
      grossInstalled >= 0 &&
        rework >= 0 &&
        rework <= grossInstalled &&
        credited >= 0,
    );
    return {
      netInstalled: grossInstalled - rework,
      gap: credited - grossInstalled + rework,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossInstalled: 100, rework: 20, credited: 75 },
  output: { netInstalled: 80, gap: -5 },
} satisfies ToolExample<Input, Output>;
export const reworkQuantityCreditGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/rework-quantity-credit-gap",
    title: "Rework Quantity Credit Gap Tool",
    description:
      "Calculate rework quantity credit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossInstalled: { type: "number", minimum: 0 },
        rework: { type: "number", minimum: 0 },
        credited: { type: "number", minimum: 0 },
      },
      required: ["grossInstalled", "rework", "credited"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netInstalled: { type: "number" }, gap: { type: "number" } },
      required: ["netInstalled", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "grossInstalled",
          label: "Gross Installed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rework",
          label: "Rework",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credited",
          label: "Credited",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netInstalled",
          label: "Net Installed",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reworkQuantityCreditGapTool.execute;
export default reworkQuantityCreditGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly produced: number;
  readonly scrap: number;
  readonly inspected: number;
  readonly useNetBase: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly inspectedFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    produced: { type: "integer", minimum: 0 },
    scrap: { type: "integer", minimum: 0 },
    inspected: { type: "integer", minimum: 0 },
    useNetBase: { type: "boolean" },
  },
  required: ["produced", "scrap", "inspected", "useNetBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    inspectedFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "inspectedFraction", "defined"],
} as const;
/** Count supplied inspection records against gross or scrap-excluded inventory bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { produced, scrap, inspected, useNetBase } = request;
  const compute = (): Output => {
    H.integer(produced, 0);
    H.integer(scrap, 0, produced);
    H.integer(inspected, 0, produced - scrap);
    return {
      denominator: produced - (useNetBase ? scrap : 0),
      inspectedFraction:
        produced - (useNetBase ? scrap : 0) > 0
          ? inspected / (produced - (useNetBase ? scrap : 0))
          : 0,
      defined: produced - (useNetBase ? scrap : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { produced: 1000, scrap: 200, inspected: 100, useNetBase: true },
  output: { denominator: 800, inspectedFraction: 0.125, defined: true },
} satisfies ToolExample<Input, Output>;
export const blisterCountScrapBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/blister-count-scrap-base-flag",
    title: "Blister Count Scrap Base Flag Tool",
    description:
      "Count supplied inspection records against gross or scrap-excluded inventory bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        produced: { type: "integer", minimum: 0 },
        scrap: { type: "integer", minimum: 0 },
        inspected: { type: "integer", minimum: 0 },
        useNetBase: { type: "boolean" },
      },
      required: ["produced", "scrap", "inspected", "useNetBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        inspectedFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "inspectedFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "produced",
          label: "Produced",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scrap",
          label: "Scrap",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inspected",
          label: "Inspected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useNetBase",
          label: "Use Net Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "inspectedFraction",
          label: "Inspected Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = blisterCountScrapBaseFlagTool.execute;
export default blisterCountScrapBaseFlagTool;

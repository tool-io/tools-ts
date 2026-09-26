import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inundatedHours: number;
  readonly observedHours: number;
  readonly missingHours: number;
  readonly excludeMissing: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inundatedHours: { type: "number", minimum: 0 },
    observedHours: { type: "number" },
    missingHours: { type: "number", minimum: 0 },
    excludeMissing: { type: "boolean" },
  },
  required: [
    "inundatedHours",
    "observedHours",
    "missingHours",
    "excludeMissing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, denominator: { type: "number" } },
  required: ["fraction", "denominator"],
} as const;
/** Calculate wetland inundation day fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inundatedHours, observedHours, missingHours, excludeMissing } =
    request;
  const compute = (): Output => {
    H.domain(
      missingHours >= 0 &&
        observedHours > missingHours &&
        inundatedHours >= 0 &&
        inundatedHours <= observedHours - missingHours,
    );
    return {
      fraction:
        inundatedHours / (observedHours - (excludeMissing ? missingHours : 0)),
      denominator: observedHours - (excludeMissing ? missingHours : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inundatedHours: 60,
    observedHours: 100,
    missingHours: 20,
    excludeMissing: true,
  },
  output: { fraction: 0.75, denominator: 80 },
} satisfies ToolExample<Input, Output>;
export const wetlandInundationDayFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/wetland-inundation-day-fraction-term",
    title: "Wetland Inundation Day Fraction Term Tool",
    description:
      "Calculate wetland inundation day fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inundatedHours: { type: "number", minimum: 0 },
        observedHours: { type: "number" },
        missingHours: { type: "number", minimum: 0 },
        excludeMissing: { type: "boolean" },
      },
      required: [
        "inundatedHours",
        "observedHours",
        "missingHours",
        "excludeMissing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["fraction", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "inundatedHours",
          label: "Inundated Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedHours",
          label: "Observed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingHours",
          label: "Missing Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMissing",
          label: "Exclude Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wetlandInundationDayFractionTermTool.execute;
export default wetlandInundationDayFractionTermTool;

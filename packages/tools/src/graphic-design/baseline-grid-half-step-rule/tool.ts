import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly step: number;
  readonly tiePolicy: string;
};
export type Output = { readonly gridIndex: number; readonly snapped: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
    tiePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["lower", "upper", "even"],
    },
  },
  required: ["coordinate", "origin", "step", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gridIndex: { type: "integer" }, snapped: { type: "number" } },
  required: ["gridIndex", "snapped"],
} as const;
/** Nearest baseline-grid coordinate with an explicit half-step lower, upper or even-index policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, step, tiePolicy } = request;
  const compute = (): Output => {
    H.positive(step);
    H.domain(["lower", "upper", "even"].includes(tiePolicy));
    const x = (coordinate - origin) / step,
      n = Math.floor(x),
      r = x - n,
      gridIndex =
        r < 0.5
          ? n
          : r > 0.5
            ? n + 1
            : tiePolicy === "lower"
              ? n
              : tiePolicy === "upper"
                ? n + 1
                : n % 2 === 0
                  ? n
                  : n + 1;
    return { gridIndex, snapped: origin + gridIndex * step };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 5, origin: 0, step: 2, tiePolicy: "even" },
  output: { gridIndex: 2, snapped: 4 },
} satisfies ToolExample<Input, Output>;
export const baselineGridHalfStepRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/baseline-grid-half-step-rule",
    title: "Baseline Grid Half Step Rule Tool",
    description:
      "Nearest baseline-grid coordinate with an explicit half-step lower, upper or even-index policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
        tiePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["lower", "upper", "even"],
        },
      },
      required: ["coordinate", "origin", "step", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gridIndex: { type: "integer" },
        snapped: { type: "number" },
      },
      required: ["gridIndex", "snapped"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "gridIndex",
          label: "Grid Index",
          valueType: { type: "integer" },
        },
        { id: "snapped", label: "Snapped", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = baselineGridHalfStepRuleTool.execute;
export default baselineGridHalfStepRuleTool;

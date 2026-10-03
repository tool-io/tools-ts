import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly needStart: number;
  readonly needEnd: number;
  readonly openingStart: number;
  readonly openingEnd: number;
};
export type Output = {
  readonly coveredDuration: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    needStart: { type: "number" },
    needEnd: { type: "number" },
    openingStart: { type: "number" },
    openingEnd: { type: "number" },
  },
  required: ["needStart", "needEnd", "openingStart", "openingEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDuration: { type: "number" },
    share: { type: "number" },
  },
  required: ["coveredDuration", "share"],
} as const;
/** Calculate resource opening coverage fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { needStart, needEnd, openingStart, openingEnd } = request;
  const compute = (): Output => {
    H.domain(needEnd > needStart && openingEnd >= openingStart);
    return {
      coveredDuration: Math.max(
        0,
        Math.min(needEnd, openingEnd) - Math.max(needStart, openingStart),
      ),
      share:
        Math.max(
          0,
          Math.min(needEnd, openingEnd) - Math.max(needStart, openingStart),
        ) /
        (needEnd - needStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { needStart: 10, needEnd: 20, openingStart: 15, openingEnd: 25 },
  output: { coveredDuration: 5, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const resourceOpeningCoverageFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/resource-opening-coverage-fraction",
    title: "Resource Opening Coverage Fraction Tool",
    description:
      "Calculate resource opening coverage fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        needStart: { type: "number" },
        needEnd: { type: "number" },
        openingStart: { type: "number" },
        openingEnd: { type: "number" },
      },
      required: ["needStart", "needEnd", "openingStart", "openingEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredDuration: { type: "number" },
        share: { type: "number" },
      },
      required: ["coveredDuration", "share"],
    },
    ports: {
      inputs: [
        {
          id: "needStart",
          label: "Need Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "needEnd",
          label: "Need End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingStart",
          label: "Opening Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingEnd",
          label: "Opening End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredDuration",
          label: "Covered Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = resourceOpeningCoverageFractionTool.execute;
export default resourceOpeningCoverageFractionTool;

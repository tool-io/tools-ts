import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domainStart: number;
  readonly domainEnd: number;
  readonly axisStart: number;
  readonly axisEnd: number;
};
export type Output = { readonly width: number; readonly axisFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainStart: { type: "number" },
    domainEnd: { type: "number" },
    axisStart: { type: "number" },
    axisEnd: { type: "number" },
  },
  required: ["domainStart", "domainEnd", "axisStart", "axisEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, axisFraction: { type: "number" } },
  required: ["width", "axisFraction"],
} as const;
/** Calculate developmental expression domain width share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domainStart, domainEnd, axisStart, axisEnd } = request;
  const compute = (): Output => {
    H.domain(
      axisEnd > axisStart &&
        domainStart >= axisStart &&
        domainEnd >= domainStart &&
        domainEnd <= axisEnd,
    );
    return {
      width: domainEnd - domainStart,
      axisFraction: (domainEnd - domainStart) / (axisEnd - axisStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domainStart: 2, domainEnd: 6, axisStart: 0, axisEnd: 10 },
  output: { width: 4, axisFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const developmentalExpressionDomainWidthShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/developmental-expression-domain-width-share",
      title: "Developmental Expression Domain Width Share Tool",
      description:
        "Calculate developmental expression domain width share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          domainStart: { type: "number" },
          domainEnd: { type: "number" },
          axisStart: { type: "number" },
          axisEnd: { type: "number" },
        },
        required: ["domainStart", "domainEnd", "axisStart", "axisEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          width: { type: "number" },
          axisFraction: { type: "number" },
        },
        required: ["width", "axisFraction"],
      },
      ports: {
        inputs: [
          {
            id: "domainStart",
            label: "Domain Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "domainEnd",
            label: "Domain End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisStart",
            label: "Axis Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisEnd",
            label: "Axis End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "width", label: "Width", valueType: { type: "number" } },
          {
            id: "axisFraction",
            label: "Axis Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalExpressionDomainWidthShareTool.execute;
export default developmentalExpressionDomainWidthShareTool;

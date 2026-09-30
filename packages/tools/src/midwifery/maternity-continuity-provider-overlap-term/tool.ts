import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProviderMinutes: number;
  readonly secondProviderMinutes: number;
  readonly simultaneousMinutes: number;
  readonly totalContactMinutes: number;
};
export type Output = {
  readonly uniqueProviderMinutes: number;
  readonly sharedContactFraction: number;
  readonly attributedPersonMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProviderMinutes: { type: "number", minimum: 0 },
    secondProviderMinutes: { type: "number", minimum: 0 },
    simultaneousMinutes: { type: "number", minimum: 0 },
    totalContactMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstProviderMinutes",
    "secondProviderMinutes",
    "simultaneousMinutes",
    "totalContactMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueProviderMinutes: { type: "number" },
    sharedContactFraction: { type: "number" },
    attributedPersonMinutes: { type: "number" },
  },
  required: [
    "uniqueProviderMinutes",
    "sharedContactFraction",
    "attributedPersonMinutes",
  ],
} as const;
/** Calculate maternity continuity provider overlap term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstProviderMinutes,
    secondProviderMinutes,
    simultaneousMinutes,
    totalContactMinutes,
  } = request;
  const compute = (): Output => {
    H.positive(totalContactMinutes);
    H.domain(
      firstProviderMinutes >= 0 &&
        secondProviderMinutes >= 0 &&
        simultaneousMinutes >= 0 &&
        simultaneousMinutes <=
          Math.min(firstProviderMinutes, secondProviderMinutes) &&
        firstProviderMinutes + secondProviderMinutes - simultaneousMinutes <=
          totalContactMinutes,
    );
    return {
      uniqueProviderMinutes:
        firstProviderMinutes + secondProviderMinutes - simultaneousMinutes,
      sharedContactFraction: simultaneousMinutes / totalContactMinutes,
      attributedPersonMinutes: firstProviderMinutes + secondProviderMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstProviderMinutes: 30,
    secondProviderMinutes: 40,
    simultaneousMinutes: 10,
    totalContactMinutes: 60,
  },
  output: {
    uniqueProviderMinutes: 60,
    sharedContactFraction: 0.16666666666666666,
    attributedPersonMinutes: 70,
  },
} satisfies ToolExample<Input, Output>;
export const maternityContinuityProviderOverlapTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "midwifery/maternity-continuity-provider-overlap-term",
      title: "Maternity Continuity Provider Overlap Term Tool",
      description:
        "Calculate maternity continuity provider overlap term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstProviderMinutes: { type: "number", minimum: 0 },
          secondProviderMinutes: { type: "number", minimum: 0 },
          simultaneousMinutes: { type: "number", minimum: 0 },
          totalContactMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstProviderMinutes",
          "secondProviderMinutes",
          "simultaneousMinutes",
          "totalContactMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueProviderMinutes: { type: "number" },
          sharedContactFraction: { type: "number" },
          attributedPersonMinutes: { type: "number" },
        },
        required: [
          "uniqueProviderMinutes",
          "sharedContactFraction",
          "attributedPersonMinutes",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstProviderMinutes",
            label: "First Provider Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondProviderMinutes",
            label: "Second Provider Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "simultaneousMinutes",
            label: "Simultaneous Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalContactMinutes",
            label: "Total Contact Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uniqueProviderMinutes",
            label: "Unique Provider Minutes",
            valueType: { type: "number" },
          },
          {
            id: "sharedContactFraction",
            label: "Shared Contact Fraction",
            valueType: { type: "number" },
          },
          {
            id: "attributedPersonMinutes",
            label: "Attributed Person Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = maternityContinuityProviderOverlapTermTool.execute;
export default maternityContinuityProviderOverlapTermTool;

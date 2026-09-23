import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly derivatives: readonly number[] };
export type Output = {
  readonly speed: number;
  readonly zeroSpeed: boolean;
  readonly unitTangentDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivatives: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["derivatives"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number" },
    zeroSpeed: { type: "boolean" },
    unitTangentDefined: { type: "boolean" },
  },
  required: ["speed", "zeroSpeed", "unitTangentDefined"],
} as const;
/** Calculate parametric speed zero domain flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { derivatives } = request;
  const compute = (): Output => {
    H.domain(derivatives.length > 0);
    return {
      speed: Math.hypot(...derivatives),
      zeroSpeed: derivatives.every((x) => x === 0),
      unitTangentDefined: derivatives.some((x) => x !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { derivatives: [0, 0] },
  output: { speed: 0, zeroSpeed: true, unitTangentDefined: false },
} satisfies ToolExample<Input, Output>;
export const parametricSpeedZeroDomainFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/parametric-speed-zero-domain-flag",
    title: "Parametric Speed Zero Domain Flag Tool",
    description:
      "Calculate parametric speed zero domain flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivatives: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["derivatives"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number" },
        zeroSpeed: { type: "boolean" },
        unitTangentDefined: { type: "boolean" },
      },
      required: ["speed", "zeroSpeed", "unitTangentDefined"],
    },
    ports: {
      inputs: [
        {
          id: "derivatives",
          label: "Derivatives",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "speed", label: "Speed", valueType: { type: "number" } },
        {
          id: "zeroSpeed",
          label: "Zero Speed",
          valueType: { type: "boolean" },
        },
        {
          id: "unitTangentDefined",
          label: "Unit Tangent Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = parametricSpeedZeroDomainFlagTool.execute;
export default parametricSpeedZeroDomainFlagTool;

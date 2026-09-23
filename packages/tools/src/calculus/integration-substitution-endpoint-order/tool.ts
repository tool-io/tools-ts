import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly mappedLower: number;
  readonly mappedUpper: number;
};
export type Output = {
  readonly orientation: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedLower: { type: "number" },
    mappedUpper: { type: "number" },
  },
  required: ["mappedLower", "mappedUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientation: { type: "integer" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["orientation", "lower", "upper"],
} as const;
/** Compute integration substitution endpoint order from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { mappedLower, mappedUpper } = input;
  const compute = (): Output => {
    return {
      orientation: Math.sign(mappedUpper - mappedLower),
      lower: Math.min(mappedLower, mappedUpper),
      upper: Math.max(mappedLower, mappedUpper),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mappedLower: 5, mappedUpper: 2 },
  output: { orientation: -1, lower: 2, upper: 5 },
} satisfies ToolExample<Input, Output>;
export const integrationSubstitutionEndpointOrderTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/integration-substitution-endpoint-order",
  title: "Integration Substitution Endpoint Order Tool",
  description:
    "Compute integration substitution endpoint order from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mappedLower",
        label: "Mapped Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "mappedUpper",
        label: "Mapped Upper",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "orientation",
        label: "Orientation",
        valueType: { type: "integer" },
      },
      { id: "lower", label: "Lower", valueType: { type: "number" } },
      { id: "upper", label: "Upper", valueType: { type: "number" } },
    ],
  },
});
export const run = integrationSubstitutionEndpointOrderTool.execute;
export default integrationSubstitutionEndpointOrderTool;

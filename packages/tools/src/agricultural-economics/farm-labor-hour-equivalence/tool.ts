import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hours: readonly number[];
  readonly suppliedEquivalence: readonly number[];
};
export type Output = { readonly equivalentHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hours: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedEquivalence: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["hours", "suppliedEquivalence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentHours: { type: "number" } },
  required: ["equivalentHours"],
} as const;
/** Calculate farm labor hour equivalence from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hours, suppliedEquivalence } = request;
  const compute = (): Output => {
    H.sameLength(hours, suppliedEquivalence);
    H.domain(
      hours.every((x) => x >= 0) && suppliedEquivalence.every((x) => x >= 0),
    );
    return { equivalentHours: H.dot(hours, suppliedEquivalence) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hours: [10, 20], suppliedEquivalence: [1, 0.5] },
  output: { equivalentHours: 20 },
} satisfies ToolExample<Input, Output>;
export const farmLaborHourEquivalenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-labor-hour-equivalence",
    title: "Farm Labor Hour Equivalence Tool",
    description:
      "Calculate farm labor hour equivalence from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hours: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedEquivalence: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["hours", "suppliedEquivalence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentHours: { type: "number" } },
      required: ["equivalentHours"],
    },
    ports: {
      inputs: [
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedEquivalence",
          label: "Supplied Equivalence",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "equivalentHours",
          label: "Equivalent Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmLaborHourEquivalenceTool.execute;
export default farmLaborHourEquivalenceTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionOrigin: readonly number[];
  readonly localPoint: readonly number[];
  readonly axisSigns: readonly number[];
};
export type Output = { readonly globalPoint: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionOrigin: { type: "array", maxItems: 256, items: { type: "number" } },
    localPoint: { type: "array", maxItems: 256, items: { type: "number" } },
    axisSigns: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["sectionOrigin", "localPoint", "axisSigns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    globalPoint: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["globalPoint"],
} as const;
/** Apply supplied axis signs and origin translations to a section coordinate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionOrigin, localPoint, axisSigns } = request;
  const compute = (): Output => {
    H.sameLength(sectionOrigin, localPoint);
    H.sameLength(localPoint, axisSigns);
    H.domain(axisSigns.every((x) => x === 1 || x === -1));
    return {
      globalPoint: localPoint.map(
        (x, i) => sectionOrigin[i] + x * axisSigns[i],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionOrigin: [10, 20, 30],
    localPoint: [1, 2, 3],
    axisSigns: [1, -1, 1],
  },
  output: { globalPoint: [11, 18, 33] },
} satisfies ToolExample<Input, Output>;
export const canalModelSectionOffsetRegistrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endodontics/canal-model-section-offset-registration-term",
      title: "Canal Model Section Offset Registration Term Tool",
      description:
        "Apply supplied axis signs and origin translations to a section coordinate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sectionOrigin: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          localPoint: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          axisSigns: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["sectionOrigin", "localPoint", "axisSigns"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          globalPoint: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["globalPoint"],
      },
      ports: {
        inputs: [
          {
            id: "sectionOrigin",
            label: "Section Origin",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "localPoint",
            label: "Local Point",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "axisSigns",
            label: "Axis Signs",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "globalPoint",
            label: "Global Point",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = canalModelSectionOffsetRegistrationTermTool.execute;
export default canalModelSectionOffsetRegistrationTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly suppliedThreshold: number;
  readonly suppressEquality: boolean;
  readonly suppressionText: string;
};
export type Output = {
  readonly suppressed: boolean;
  readonly displayText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    suppliedThreshold: { type: "integer", minimum: 0 },
    suppressEquality: { type: "boolean" },
    suppressionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "count",
    "suppliedThreshold",
    "suppressEquality",
    "suppressionText",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppressed: { type: "boolean" },
    displayText: { type: "string", maxLength: 8192 },
  },
  required: ["suppressed", "displayText"],
} as const;
/** Apply an explicit small-count display rule without selecting a disclosure threshold or certifying anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, suppliedThreshold, suppressEquality, suppressionText } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(count) &&
        count >= 0 &&
        count <= Number.MAX_SAFE_INTEGER,
      "count",
    ),
      count);
    (H.domain(
      Number.isSafeInteger(suppliedThreshold) &&
        suppliedThreshold >= 0 &&
        suppliedThreshold <= Number.MAX_SAFE_INTEGER,
      "suppliedThreshold",
    ),
      suppliedThreshold);
    H.domain(suppressionText.length > 0, "suppressionText");
    return (() => {
      const suppressed = suppressEquality
        ? count <= suppliedThreshold
        : count < suppliedThreshold;
      return {
        suppressed,
        displayText: suppressed ? suppressionText : String(count),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    count: 3,
    suppliedThreshold: 5,
    suppressEquality: false,
    suppressionText: "<5",
  },
  output: { suppressed: true, displayText: "<5" },
} satisfies ToolExample<Input, Output>;
export const publicHealthSmallCellDisplayRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["public-health", "public health", "health and medicine"],
      keywords: ["public health", "health and medicine"],
    },
    id: "public-health/public-health-small-cell-display-rule",
    title: "Public Health Small Cell Display Rule",
    description:
      "Apply an explicit small-count display rule without selecting a disclosure threshold or certifying anonymization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        suppliedThreshold: { type: "integer", minimum: 0 },
        suppressEquality: { type: "boolean" },
        suppressionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "count",
        "suppliedThreshold",
        "suppressEquality",
        "suppressionText",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppressed: { type: "boolean" },
        displayText: { type: "string", maxLength: 8192 },
      },
      required: ["suppressed", "displayText"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppressEquality",
          label: "Suppress Equality",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppressionText",
          label: "Suppression Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "suppressed",
          label: "Suppressed",
          valueType: { type: "boolean" },
        },
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicHealthSmallCellDisplayRuleTool.execute;
export default publicHealthSmallCellDisplayRuleTool;

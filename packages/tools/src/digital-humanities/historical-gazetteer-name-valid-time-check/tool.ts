import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly validFrom: number;
  readonly validThrough: number;
  readonly inclusiveEnd: boolean;
};
export type Output = { readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    validFrom: { type: "integer" },
    validThrough: { type: "integer" },
    inclusiveEnd: { type: "boolean" },
  },
  required: ["year", "validFrom", "validThrough", "inclusiveEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" } },
  required: ["valid"],
} as const;
/** Apply explicit astronomical-year validity bounds to a supplied name record; no historical name lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, validFrom, validThrough, inclusiveEnd } = request;
  const compute = (): Output => {
    H.domain(validThrough >= validFrom);
    return {
      valid:
        year >= validFrom &&
        (inclusiveEnd ? year <= validThrough : year < validThrough),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    year: 1900,
    validFrom: 1800,
    validThrough: 1900,
    inclusiveEnd: true,
  },
  output: { valid: true },
} satisfies ToolExample<Input, Output>;
export const historicalGazetteerNameValidTimeCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "digital-humanities/historical-gazetteer-name-valid-time-check",
      title: "Historical Gazetteer Name Valid Time Check Tool",
      description:
        "Apply explicit astronomical-year validity bounds to a supplied name record; no historical name lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          year: { type: "integer" },
          validFrom: { type: "integer" },
          validThrough: { type: "integer" },
          inclusiveEnd: { type: "boolean" },
        },
        required: ["year", "validFrom", "validThrough", "inclusiveEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { valid: { type: "boolean" } },
        required: ["valid"],
      },
      ports: {
        inputs: [
          {
            id: "year",
            label: "Year",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "validFrom",
            label: "Valid From",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "validThrough",
            label: "Valid Through",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusiveEnd",
            label: "Inclusive End",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = historicalGazetteerNameValidTimeCheckTool.execute;
export default historicalGazetteerNameValidTimeCheckTool;

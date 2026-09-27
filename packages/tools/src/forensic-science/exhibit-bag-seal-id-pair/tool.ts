import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSeal: string;
  readonly observedSeal: string;
  readonly recordedBag: string;
  readonly observedBag: string;
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly sealMatches: boolean;
  readonly bagMatches: boolean;
  readonly pairMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeal: { type: "string", maxLength: 8192 },
    observedSeal: { type: "string", maxLength: 8192 },
    recordedBag: { type: "string", maxLength: 8192 },
    observedBag: { type: "string", maxLength: 8192 },
    caseSensitive: { type: "boolean" },
  },
  required: [
    "recordedSeal",
    "observedSeal",
    "recordedBag",
    "observedBag",
    "caseSensitive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealMatches: { type: "boolean" },
    bagMatches: { type: "boolean" },
    pairMatches: { type: "boolean" },
  },
  required: ["sealMatches", "bagMatches", "pairMatches"],
} as const;
/** Exact or Unicode lowercase identifier comparison without trimming or punctuation removal; matching labels do not authenticate an exhibit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedSeal,
    observedSeal,
    recordedBag,
    observedBag,
    caseSensitive,
  } = request;
  const compute = (): Output => {
    H.domain(
      recordedSeal.length > 0 &&
        observedSeal.length > 0 &&
        recordedBag.length > 0 &&
        observedBag.length > 0,
    );
    return {
      sealMatches: caseSensitive
        ? recordedSeal === observedSeal
        : recordedSeal.toLowerCase() === observedSeal.toLowerCase(),
      bagMatches: caseSensitive
        ? recordedBag === observedBag
        : recordedBag.toLowerCase() === observedBag.toLowerCase(),
      pairMatches:
        (caseSensitive
          ? recordedSeal === observedSeal
          : recordedSeal.toLowerCase() === observedSeal.toLowerCase()) &&
        (caseSensitive
          ? recordedBag === observedBag
          : recordedBag.toLowerCase() === observedBag.toLowerCase()),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedSeal: "S12",
    observedSeal: "s12",
    recordedBag: "B4",
    observedBag: "B4",
    caseSensitive: false,
  },
  output: { sealMatches: true, bagMatches: true, pairMatches: true },
} satisfies ToolExample<Input, Output>;
export const exhibitBagSealIdPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/exhibit-bag-seal-id-pair",
    title: "Exhibit Bag Seal ID Pair Tool",
    description:
      "Exact or Unicode lowercase identifier comparison without trimming or punctuation removal; matching labels do not authenticate an exhibit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeal: { type: "string", maxLength: 8192 },
        observedSeal: { type: "string", maxLength: 8192 },
        recordedBag: { type: "string", maxLength: 8192 },
        observedBag: { type: "string", maxLength: 8192 },
        caseSensitive: { type: "boolean" },
      },
      required: [
        "recordedSeal",
        "observedSeal",
        "recordedBag",
        "observedBag",
        "caseSensitive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealMatches: { type: "boolean" },
        bagMatches: { type: "boolean" },
        pairMatches: { type: "boolean" },
      },
      required: ["sealMatches", "bagMatches", "pairMatches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSeal",
          label: "Recorded Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedSeal",
          label: "Observed Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedBag",
          label: "Recorded Bag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedBag",
          label: "Observed Bag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sealMatches",
          label: "Seal Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "bagMatches",
          label: "Bag Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "pairMatches",
          label: "Pair Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitBagSealIdPairTool.execute;
export default exhibitBagSealIdPairTool;

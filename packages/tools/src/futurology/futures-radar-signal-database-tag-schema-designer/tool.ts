import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const trendDirections = ["emerging", "growing", "stable", "declining"] as const;

export type FuturesRadarSchemaInput = {
  readonly signalRecords: ReadonlyArray<string>;
};

export type FuturesRadarSchemaOutput = {
  readonly normalizedRecords: ReadonlyArray<string>;
  readonly recordCount: number;
  readonly schemaFields: ReadonlyArray<string>;
  readonly tagVocabulary: ReadonlyArray<string>;
};

export const designFuturesRadarSignalSchema = (
  input: FuturesRadarSchemaInput,
): FuturesRadarSchemaOutput => {
  if (!Array.isArray(input.signalRecords) || input.signalRecords.length === 0)
    simpleError(
      "signalRecords",
      "At least one signal record is required.",
      "signal_records_required",
    );
  const normalizedRecords: string[] = [];
  const domains = new Set<string>();
  const horizons = new Set<string>();
  const trendTags = new Set<string>();
  for (const [recordIndex, record] of input.signalRecords.entries()) {
    if (typeof record !== "string")
      simpleError(
        `signalRecords.${recordIndex}`,
        "Signal records must be strings.",
        "invalid_signal_record",
      );
    const parts = record.split("|");
    if (parts.length !== 6)
      simpleError(
        `signalRecords.${recordIndex}`,
        "Signal records must use name|domain|horizon|confidence|impact|trend form.",
        "invalid_signal_record",
      );
    const [name, domain, horizon, rawConfidence, rawImpact, trend] = parts.map(
      (part) => part.trim(),
    );
    if (!name || !domain || !horizon || !rawConfidence || !rawImpact || !trend)
      simpleError(
        `signalRecords.${recordIndex}`,
        "Every signal-record field must be nonempty.",
        "invalid_signal_record",
      );
    const confidence = Number(rawConfidence);
    const impact = Number(rawImpact);
    if (
      !Number.isFinite(confidence) ||
      confidence < 0 ||
      confidence > 100 ||
      !Number.isFinite(impact) ||
      impact < 0 ||
      impact > 100
    )
      simpleError(
        `signalRecords.${recordIndex}`,
        "Confidence and impact must be finite values from 0 through 100.",
        "invalid_signal_score",
      );
    if (!trendDirections.includes(trend as (typeof trendDirections)[number]))
      simpleError(
        `signalRecords.${recordIndex}`,
        "Trend must be emerging, growing, stable, or declining.",
        "invalid_trend_direction",
      );
    domains.add(domain!);
    horizons.add(horizon!);
    trendTags.add(trend!);
    normalizedRecords.push(
      `${name}; domain=${domain}; horizon=${horizon}; confidence=${confidence}%; impact=${impact}%; trend=${trend}`,
    );
  }
  return {
    normalizedRecords,
    recordCount: normalizedRecords.length,
    schemaFields: [
      "name",
      "domain",
      "horizon",
      "confidencePercent",
      "impactPercent",
      "trendDirection",
    ],
    tagVocabulary: [...new Set([...domains, ...horizons, ...trendTags])].sort(),
  };
};

export const futuresRadarSchemaExample = {
  input: {
    signalRecords: [
      "Battery pilot|energy|near-term|70|80|growing",
      "New grid rule|policy|mid-term|60|90|emerging",
    ],
  },
  output: {
    normalizedRecords: [
      "Battery pilot; domain=energy; horizon=near-term; confidence=70%; impact=80%; trend=growing",
      "New grid rule; domain=policy; horizon=mid-term; confidence=60%; impact=90%; trend=emerging",
    ],
    recordCount: 2,
    schemaFields: [
      "name",
      "domain",
      "horizon",
      "confidencePercent",
      "impactPercent",
      "trendDirection",
    ],
    tagVocabulary: [
      "emerging",
      "energy",
      "growing",
      "mid-term",
      "near-term",
      "policy",
    ],
  },
} satisfies ToolExample<FuturesRadarSchemaInput, FuturesRadarSchemaOutput>;

export const futuresRadarSchemaTool = createSimpleTool({
  calculate: (input) =>
    designFuturesRadarSignalSchema({
      signalRecords: input.signalRecords as string[],
    }),
  description:
    "Normalize pipe-delimited futures-radar signal records and generate field definitions plus a controlled tag vocabulary.",
  id: "futurology/futures-radar-signal-database-tag-schema-designer",
  inputs: [
    {
      description:
        "Records in name|domain|horizon|confidence|impact|trend form.",
      id: "signalRecords",
      kind: "stringList",
      label: "Signal records",
    },
  ],
  outputs: [
    {
      id: "normalizedRecords",
      kind: "stringList",
      label: "Normalized signal records",
    },
    { id: "recordCount", kind: "integer", label: "Signal records", minimum: 1 },
    { id: "schemaFields", kind: "stringList", label: "Schema fields" },
    { id: "tagVocabulary", kind: "stringList", label: "Tag vocabulary" },
  ],
  title: "Futures Radar Signal Database Tag Schema Designer",
});

export const runFuturesRadarSchema = futuresRadarSchemaTool.execute;
export default futuresRadarSchemaTool;

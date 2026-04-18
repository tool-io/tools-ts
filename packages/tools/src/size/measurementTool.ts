import { defineTool, type ToolDefinition } from "../core/definition.js";
import {
  listTextType,
  numberFiniteType,
  quantityLengthCentimetersType,
  quantityMassKilogramsType,
  textPlainType,
  type ToolSemanticType,
  unitMeasurementType,
} from "../core/semantic-type.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";

export type MeasurementSizeKind = string;

export type MeasurementField = {
  readonly defaultCm: number;
  readonly label: string;
  readonly maxCm: number;
  readonly minCm: number;
  readonly quantity?: "length" | "mass" | "number";
};

export type MeasurementSizeConfig = {
  readonly fields: Readonly<Record<string, MeasurementField>>;
  readonly intro: string;
  readonly kind: MeasurementSizeKind;
  readonly name: string;
  readonly mode?: "body" | "dimensions" | "equipment" | "historical";
};

export type MeasurementSizeInput = {
  readonly unit?: "cm" | "in";
  readonly values: Readonly<Record<string, number>>;
};

export type MeasurementSizeOutput = {
  readonly equivalents: readonly string[];
  readonly kind: MeasurementSizeKind;
  readonly measurementsCm: Readonly<Record<string, number>>;
  readonly primary: string;
  readonly warning: string;
};

const apparelWarning =
  "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.";

const titleCase = (slug: string): string =>
  slug
    .split("-")
    .map((word) =>
      word === "t" ? "T" : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

const round = (value: number, digits = 1): number =>
  Number(value.toFixed(digits));
const inches = (cm: number): number => cm / 2.54;
const pounds = (kg: number): number => kg / 0.45359237;
const metricText = (value: number, field?: MeasurementField): string =>
  field?.quantity === "mass"
    ? `${round(value)} kg`
    : field?.quantity === "number"
      ? `${round(value)}`
      : `${round(value)} cm`;
const imperialText = (value: number, field?: MeasurementField): string =>
  field?.quantity === "mass"
    ? `${round(pounds(value))} lb`
    : field?.quantity === "number"
      ? `${round(value)}`
      : `${round(inches(value))} in`;
const alphaSize = (cm: number): string => {
  const labels = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const limits = [78, 84, 90, 96, 104, 112, 122];
  return labels[limits.findIndex((limit) => cm <= limit)] ?? labels.at(-1)!;
};
const nearestEven = (value: number): number => Math.round(value / 2) * 2;
const nearestFive = (value: number): number => Math.round(value / 5) * 5;

export type MeasurementSizeTableRow = {
  readonly imperial: string;
  readonly label: string;
  readonly metric: string;
  readonly note: string;
  readonly selected: boolean;
};

const rangeRow = (
  label: string,
  minimumCm: number,
  maximumCm: number,
  selectedValue: number,
  note = "",
): MeasurementSizeTableRow => ({
  imperial: `${round(inches(minimumCm))}–${round(inches(maximumCm))} in`,
  label,
  metric: `${round(minimumCm)}–${round(maximumCm)} cm`,
  note,
  selected: selectedValue >= minimumCm && selectedValue < maximumCm,
});

export const createMeasurementSizeTableForConfig = (
  config: MeasurementSizeConfig,
  kind: MeasurementSizeKind,
  measurementsCm: Readonly<Record<string, number>>,
): readonly MeasurementSizeTableRow[] => {
  const firstValue = Object.values(measurementsCm)[0] ?? 0;
  if (kind === "ring" || kind === "smart-ring") {
    return Array.from({ length: 19 }, (_, index) => {
      const us = 4 + index / 2;
      const circumference = 46.8 + index * 1.27;
      return rangeRow(
        `US ${us} · ISO ${Math.round(circumference)}`,
        circumference / 10 - 0.064,
        circumference / 10 + 0.064,
        firstValue,
        `Diameter ${round(circumference / Math.PI)} mm`,
      );
    });
  }
  if (kind === "belt")
    return Array.from({ length: 13 }, (_, index) => {
      const size = 70 + index * 5;
      return rangeRow(
        `EU ${size}`,
        size - 2.5,
        size + 2.5,
        measurementsCm.waist,
        `Approx. US ${nearestEven(inches(size) + 2)}`,
      );
    });
  if (kind === "collar" || kind === "dress-shirt")
    return Array.from({ length: 15 }, (_, index) => {
      const size = 36 + index;
      return rangeRow(
        `${size} cm / ${round(inches(size) * 2) / 2} in`,
        size - 2,
        size - 1,
        measurementsCm.neck,
        "Includes about 1.5 cm comfort allowance",
      );
    });
  if (kind === "gloves")
    return Array.from({ length: 11 }, (_, index) => {
      const size = 6 + index / 2;
      const cm = size * 2.54;
      return rangeRow(
        `Glove ${size}`,
        cm - 0.64,
        cm + 0.64,
        measurementsCm.hand,
      );
    });
  if (kind === "pants" || kind === "jeans")
    return Array.from({ length: 27 }, (_, index) => {
      const waistIn = 24 + index;
      const cm = waistIn * 2.54;
      return rangeRow(
        `W${waistIn}`,
        cm - 1.27,
        cm + 1.27,
        measurementsCm.waist ?? measurementsCm.body,
        kind === "pants"
          ? `Combine with L${Math.round(inches(measurementsCm.inseam ?? 81))}`
          : "Waist label",
      );
    });
  if (kind === "socks")
    return [
      rangeRow("S", 20, 23, measurementsCm.footLength),
      rangeRow("M", 23, 26, measurementsCm.footLength),
      rangeRow("L", 26, 29, measurementsCm.footLength),
      rangeRow("XL", 29, 33, measurementsCm.footLength),
    ];
  if (kind === "watch-band")
    return [
      rangeRow("Short", 11, 15, measurementsCm.wrist),
      rangeRow("Regular", 15, 19, measurementsCm.wrist),
      rangeRow("Long", 19, 25, measurementsCm.wrist),
    ];
  if (kind === "suit-jacket")
    return Array.from({ length: 11 }, (_, index) => {
      const chestIn = 32 + index * 2;
      const cm = chestIn * 2.54;
      return rangeRow(
        `US / UK ${chestIn} · EU ${nearestEven(cm / 2)}`,
        cm - 2.54,
        cm + 2.54,
        measurementsCm.chest,
      );
    });
  if (kind === "shawl")
    return [
      rangeRow("Scarf-sized", 40, 120, measurementsCm.length, "Length"),
      rangeRow("Shoulder wrap", 120, 160, measurementsCm.length, "Length"),
      rangeRow("Full shawl", 160, 190, measurementsCm.length, "Length"),
      rangeRow("Oversized wrap", 190, 400, measurementsCm.length, "Length"),
    ];

  if (
    config.mode === "dimensions" ||
    config.mode === "equipment" ||
    config.mode === "historical"
  ) {
    return Object.entries(measurementsCm).map(([field, value]) => ({
      imperial: imperialText(value, config.fields[field]),
      label: config.fields[field]?.label ?? titleCase(field),
      metric: metricText(value, config.fields[field]),
      note:
        config.mode === "historical"
          ? "Reconstruction measurement"
          : config.mode === "equipment"
            ? "Verify manufacturer fit table"
            : "Nominal measurement",
      selected: true,
    }));
  }
  const ranges: readonly [string, number, number][] = [
    ["XXS", 0, 78],
    ["XS", 78, 84],
    ["S", 84, 90],
    ["M", 90, 96],
    ["L", 96, 104],
    ["XL", 104, 112],
    ["2XL", 112, 122],
    ["3XL", 122, 260],
  ];
  return ranges.map(([label, minimum, maximum]) =>
    rangeRow(label, minimum, maximum, firstValue, "Primary body measurement"),
  );
};

const ringAdvice = (
  circumferenceCm: number,
): Pick<MeasurementSizeOutput, "primary" | "equivalents"> => {
  const circumferenceMm = circumferenceCm * 10;
  const diameterMm = circumferenceMm / Math.PI;
  const us = Math.max(1, Math.round(((circumferenceMm - 36.5) / 2.55) * 2) / 2);
  const ukIndex = Math.max(0, Math.round((circumferenceMm - 37.8) / 1.25));
  const uk =
    String.fromCharCode(65 + Math.floor(ukIndex / 2)) +
    (ukIndex % 2 ? "½" : "");
  return {
    primary: `ISO / EU ${Math.round(circumferenceMm)}`,
    equivalents: [
      `Inner diameter ${round(diameterMm)} mm`,
      `US ${us}`,
      `UK ${uk}`,
      `Japan ${Math.max(1, Math.round(circumferenceMm - 40))}`,
    ],
  };
};

const buildAdvice = (
  config: MeasurementSizeConfig,
  kind: MeasurementSizeKind,
  values: Readonly<Record<string, number>>,
): Pick<MeasurementSizeOutput, "primary" | "equivalents" | "warning"> => {
  switch (kind) {
    case "belt": {
      const eu = nearestFive(values.waist);
      return {
        primary: `EU ${eu}`,
        equivalents: [
          `US ${nearestEven(inches(values.waist) + 2)} in`,
          `Suggested center-hole length ${eu} cm`,
        ],
        warning: apparelWarning,
      };
    }
    case "collar": {
      const comfortable = values.neck + 1.5;
      return {
        primary: `${Math.round(comfortable)} cm collar`,
        equivalents: [
          `${round(inches(comfortable) * 2) / 2} in collar`,
          `Measured neck ${round(values.neck)} cm`,
        ],
        warning: apparelWarning,
      };
    }
    case "dress": {
      const score = Math.max(values.bust, values.waist + 18, values.hip - 8);
      const alpha = alphaSize(score);
      const us = Math.max(0, nearestEven((score - 80) / 2));
      return {
        primary: alpha,
        equivalents: [`US ${us}`, `UK ${us + 4}`, `EU ${us + 30}`],
        warning: apparelWarning,
      };
    }
    case "dress-shirt": {
      const collar = Math.round(values.neck + 1.5);
      return {
        primary: `${collar} cm / ${round(inches(collar) * 2) / 2} in collar`,
        equivalents: [
          `Sleeve ${Math.round(values.sleeve)} cm`,
          `Sleeve ${round(inches(values.sleeve) * 2) / 2} in`,
        ],
        warning: apparelWarning,
      };
    }
    case "gloves": {
      const numeric = Math.round(inches(values.hand) * 2) / 2;
      return {
        primary: `Glove ${numeric}`,
        equivalents: [
          `Hand girth ${round(values.hand)} cm`,
          `Alpha ${alphaSize(values.hand * 4.6)}`,
        ],
        warning: apparelWarning,
      };
    }
    case "pants": {
      const waist = Math.round(inches(values.waist));
      const inseam = Math.round(inches(values.inseam));
      return {
        primary: `W${waist} / L${inseam}`,
        equivalents: [
          `Alpha ${alphaSize(values.waist)}`,
          `Waist ${round(values.waist)} cm`,
          `Hip ${round(values.hip)} cm`,
        ],
        warning: apparelWarning,
      };
    }
    case "jeans": {
      const waist = Math.round(inches(values.waist));
      return {
        primary: `W${waist}`,
        equivalents: [
          `Waist ${round(values.waist)} cm`,
          `Waist ${round(inches(values.waist))} in`,
          `Alpha ${
            values.waist < 70
              ? "XS"
              : values.waist < 78
                ? "S"
                : values.waist < 88
                  ? "M"
                  : values.waist < 98
                    ? "L"
                    : values.waist < 110
                      ? "XL"
                      : "2XL+"
          }`,
        ],
        warning: apparelWarning,
      };
    }
    case "bra": {
      const bandCm = nearestFive(values.underbust);
      const differenceCm = Math.max(0, values.bust - values.underbust);
      const cups = ["AA", "A", "B", "C", "D", "DD/E", "F", "G", "H"];
      const cup =
        cups[
          Math.min(
            cups.length - 1,
            Math.max(0, Math.round((differenceCm - 10) / 2.5)),
          )
        ] ?? "AA";
      return {
        primary: `EU ${bandCm}${cup}`,
        equivalents: [
          `Underbust ${round(values.underbust)} cm`,
          `Bust ${round(values.bust)} cm`,
          "Sizing systems and cup progression differ by country",
        ],
        warning: apparelWarning,
      };
    }
    case "baby-clothing":
    case "children-clothing": {
      const height = Math.round(values.height);
      return {
        primary: `Height size ${height}`,
        equivalents: [
          `Body height ${height} cm`,
          `Body height ${round(inches(height))} in`,
        ],
        warning:
          "Children’s labels may also use age, but body height is the more useful starting measurement. Check the maker’s chart and allow for movement and growth.",
      };
    }
    case "ring":
    case "smart-ring": {
      const advice = ringAdvice(values.circumference);
      return {
        ...advice,
        warning:
          kind === "smart-ring"
            ? "Smart-ring shells and sensor clearances vary. Always confirm with the manufacturer’s physical sizing kit."
            : "Finger size changes with temperature and time of day. Measure more than once and confirm wide bands with a jeweller.",
      };
    }
    case "shawl": {
      const style =
        values.length >= 190
          ? "Oversized wrap"
          : values.length >= 160
            ? "Full shawl"
            : values.length >= 120
              ? "Shoulder wrap"
              : "Scarf-sized";
      return {
        primary: style,
        equivalents: [
          `${round(values.width)} × ${round(values.length)} cm`,
          `${round(inches(values.width))} × ${round(inches(values.length))} in`,
        ],
        warning:
          "Shawl names describe use rather than standardized sizes; drape also depends on fabric and shape.",
      };
    }
    case "socks": {
      const alpha =
        values.footLength < 23
          ? "S"
          : values.footLength < 26
            ? "M"
            : values.footLength < 29
              ? "L"
              : "XL";
      return {
        primary: `Sock ${alpha}`,
        equivalents: [
          `Foot length ${round(values.footLength)} cm`,
          `Approx. EU shoe ${Math.round(values.footLength * 1.5 + 2)}`,
          `Approx. US men ${round(values.footLength * 3 - 71)}`,
        ],
        warning: apparelWarning,
      };
    }
    case "suit-jacket": {
      const chestIn = nearestEven(inches(values.chest));
      const length =
        values.height < 170
          ? "Short"
          : values.height > 185
            ? "Long"
            : "Regular";
      return {
        primary: `US / UK ${chestIn} ${length}`,
        equivalents: [
          `EU ${nearestEven(values.chest / 2)}`,
          `Chest ${round(values.chest)} cm`,
          `Length ${length}`,
        ],
        warning: apparelWarning,
      };
    }
    case "sweater":
    case "t-shirt": {
      const alpha = alphaSize(values.chest);
      return {
        primary: alpha,
        equivalents: [
          `Chest ${round(values.chest)} cm`,
          `Chest ${round(inches(values.chest))} in`,
          `EU body-size indicator ${nearestEven(values.chest / 2)}`,
        ],
        warning: apparelWarning,
      };
    }
    case "watch-band": {
      const total = values.wrist + 3;
      const label =
        values.wrist < 15 ? "Short" : values.wrist <= 19 ? "Regular" : "Long";
      return {
        primary: `${label} band`,
        equivalents: [
          `Wrist ${round(values.wrist)} cm / ${round(inches(values.wrist))} in`,
          `Approx. wearable band length ${Math.round(total)} cm`,
        ],
        warning:
          "Measure where the watch sits. Case length, clasp overlap, adjustment holes, and manufacturer measuring conventions affect fit.",
      };
    }
    case "anklet":
    case "bracelet":
    case "smartwatch": {
      const circumference = values.ankle ?? values.wrist;
      const finished = circumference + values.ease;
      return {
        primary: `${round(finished)} cm finished length`,
        equivalents: [
          `Body circumference ${round(circumference)} cm`,
          `Preferred ease ${round(values.ease)} cm`,
          `${round(inches(finished))} in finished length`,
        ],
        warning:
          "Clasp overlap, link dimensions, stretch, and manufacturer measuring conventions can change the required finished length.",
      };
    }
    case "choker": {
      const finished = values.neck + values.ease;
      return {
        primary: `${round(finished)} cm choker length`,
        equivalents: [
          `Neck ${round(values.neck)} cm`,
          `Ease ${round(values.ease)} cm`,
          `${round(inches(finished))} in finished length`,
        ],
        warning:
          "A choker must not restrict breathing or swallowing. Add comfort ease and account for the clasp or extender.",
      };
    }
    case "necklace": {
      const finished = values.neck + values.desiredDrop * 2;
      return {
        primary: `${round(finished)} cm necklace`,
        equivalents: [
          `Neck ${round(values.neck)} cm`,
          `Approx. drop ${round(values.desiredDrop)} cm`,
          `${round(inches(finished))} in finished length`,
        ],
        warning:
          "Pendant dimensions, chain thickness, clasp, and neckline affect the visible drop.",
      };
    }
    case "bangle": {
      const diameter = values.hand / Math.PI;
      return {
        primary: `${round(diameter)} cm minimum inner diameter`,
        equivalents: [
          `Hand circumference ${round(values.hand)} cm`,
          `${round(inches(diameter))} in inner diameter`,
        ],
        warning:
          "Rigid bangles must pass over the widest compressed part of the hand. Hinged bangles may use wrist measurements instead.",
      };
    }
    case "cap":
    case "hat":
    case "helmet": {
      const alpha =
        values.head < 54
          ? "S"
          : values.head < 58
            ? "M"
            : values.head < 61
              ? "L"
              : "XL";
      return {
        primary: `${alpha} · ${Math.round(values.head)} cm`,
        equivalents: [
          `Head circumference ${round(values.head)} cm`,
          `US hat size about ${round(inches(values.head) / Math.PI, 2)}`,
        ],
        warning:
          kind === "helmet"
            ? "Helmet fit is safety-critical. Use the manufacturer’s current chart and perform its complete fit and retention check."
            : apparelWarning,
      };
    }
    case "dog-collar": {
      const finished = values.neck + values.ease;
      return {
        primary: `${round(finished)} cm collar setting`,
        equivalents: [
          `Neck ${round(values.neck)} cm`,
          `Allowance ${round(values.ease)} cm`,
        ],
        warning:
          "Confirm the manufacturer’s measuring point and check that the collar cannot slip over the head or restrict breathing.",
      };
    }
    default: {
      const measurements = Object.entries(values).map(
        ([field, value]) =>
          `${config.fields[field]?.label ?? titleCase(field)}: ${metricText(
            value,
            config.fields[field],
          )} / ${imperialText(value, config.fields[field])}`,
      );
      if (config.mode === "historical")
        return {
          primary: "Made-to-measure reconstruction",
          equivalents: measurements,
          warning:
            "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
        };
      if (config.mode === "dimensions")
        return {
          primary: "Measured specification",
          equivalents: measurements,
          warning:
            "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
        };
      if (config.mode === "equipment")
        return {
          primary: "Measurement-based fit profile",
          equivalents: measurements,
          warning:
            "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
        };
      return {
        primary: alphaSize(Object.values(values)[0] ?? 0),
        equivalents: measurements,
        warning: apparelWarning,
      };
    }
  }
};

export const recommendMeasurementSizeForConfig = (
  config: MeasurementSizeConfig,
  input: unknown,
): ToolResult<MeasurementSizeOutput> => {
  const kind = config.kind;
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const record = input as Record<string, unknown>;
  if (
    typeof record.values !== "object" ||
    record.values === null ||
    Array.isArray(record.values)
  )
    return invalidInput([
      {
        code: "values_required",
        field: "values",
        message: "Measurements must be an object.",
      },
    ]);
  const unit = record.unit === "in" ? "in" : "cm";
  const values = record.values as Record<string, unknown>;
  const measurementsCm: Record<string, number> = {};
  for (const [field, definition] of Object.entries(config.fields)) {
    const raw = Number(values[field]);
    const metricValue =
      unit === "in"
        ? definition.quantity === "mass"
          ? raw * 0.45359237
          : definition.quantity === "number"
            ? raw
            : raw * 2.54
        : raw;
    if (
      !Number.isFinite(metricValue) ||
      metricValue < definition.minCm ||
      metricValue > definition.maxCm
    )
      return invalidInput([
        {
          code: "measurement_out_of_range",
          field,
          message: `${definition.label} is outside the supported range.`,
        },
      ]);
    measurementsCm[field] = metricValue;
  }
  const advice = buildAdvice(config, kind, measurementsCm);
  return toolSuccess({ kind, measurementsCm, ...advice });
};

export const createMeasurementSizeTool = (
  config: MeasurementSizeConfig,
): ToolDefinition<MeasurementSizeInput, MeasurementSizeOutput> => {
  const kind = config.kind;
  const measurementType = (field: MeasurementField): ToolSemanticType =>
    field.quantity === "mass"
      ? quantityMassKilogramsType
      : field.quantity === "number"
        ? numberFiniteType
        : quantityLengthCentimetersType;
  return defineTool({
    contractVersion: 1,
    description: config.intro,
    execute: (input) => recommendMeasurementSizeForConfig(config, input),
    executionKind: "pure",
    id: `size/${kind}`,
    inputSchema: {
      additionalProperties: false,
      properties: {
        unit: { enum: ["cm", "in"], type: "string" },
        values: { type: "object" },
      },
      required: ["values"],
      type: "object",
    },
    isOutput: (value): value is MeasurementSizeOutput =>
      typeof value === "object" &&
      value !== null &&
      (value as { kind?: unknown }).kind === kind,
    outputSchema: {
      additionalProperties: false,
      properties: {
        equivalents: { type: "array" },
        kind: { const: kind },
        measurementsCm: { type: "object" },
        primary: { type: "string" },
        warning: { type: "string" },
      },
      required: ["equivalents", "kind", "measurementsCm", "primary", "warning"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "unit",
          label: "Input unit",
          path: ["unit"],
          type: unitMeasurementType,
        },
        ...Object.entries(config.fields).map(([id, field]) => ({
          id,
          label: field.label,
          path: ["values", id],
          required: true,
          type: measurementType(field),
        })),
      ],
      outputs: [
        ...Object.entries(config.fields).map(([id, field]) => ({
          id,
          label: `${field.label} in canonical units`,
          path: ["measurementsCm", id],
          type: measurementType(field),
        })),
        {
          id: "primary",
          label: "Recommended size",
          type: textPlainType,
        },
        {
          id: "equivalents",
          label: "Equivalent sizes",
          type: listTextType,
        },
        {
          id: "warning",
          label: "Sizing warning",
          type: textPlainType,
        },
      ],
    },
    title: config.name,
  });
};

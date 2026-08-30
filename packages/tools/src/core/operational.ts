import type { ToolExample } from "./example.js";
import { createSimpleTool, simpleError, type SimpleField } from "./simple.js";

const finiteResult = (field: string, value: number): number => {
  if (!Number.isFinite(value))
    simpleError(
      field,
      "The result is outside the numeric range.",
      "numeric_overflow",
    );
  return Object.is(value, -0) ? 0 : value;
};

const normalizedSet = (values: readonly string[]): Map<string, string> => {
  const result = new Map<string, string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed.length === 0)
      simpleError("values", "List entries must not be empty.", "empty_entry");
    result.set(trimmed.toLocaleLowerCase("en-US"), trimmed);
  }
  return result;
};

export const createSetAudit = (config: {
  readonly description: string;
  readonly expected: Readonly<{ id: string; label: string }>;
  readonly example: Readonly<{
    expected: readonly string[];
    observed: readonly string[];
  }>;
  readonly id: string;
  readonly observed: Readonly<{ id: string; label: string }>;
  readonly title: string;
}) => {
  type Input = Readonly<Record<string, readonly string[]>>;
  type Output = Readonly<{
    coveragePercent: number;
    matched: readonly string[];
    missing: readonly string[];
    unexpected: readonly string[];
  }>;
  const calculate = (input: Input): Output => {
    const expectedValues = input[config.expected.id];
    const observedValues = input[config.observed.id];
    const expected = normalizedSet(expectedValues);
    const observed = normalizedSet(observedValues);
    if (expected.size === 0)
      simpleError(
        config.expected.id,
        "At least one expected item is required.",
        "empty_expected_set",
      );
    const matched = [...expected]
      .filter(([key]) => observed.has(key))
      .map(([, value]) => value);
    const missing = [...expected]
      .filter(([key]) => !observed.has(key))
      .map(([, value]) => value);
    const unexpected = [...observed]
      .filter(([key]) => !expected.has(key))
      .map(([, value]) => value);
    return {
      coveragePercent: finiteResult(
        "coveragePercent",
        (matched.length / expected.size) * 100,
      ),
      matched,
      missing,
      unexpected,
    };
  };
  const exampleInput: Input = {
    [config.expected.id]: config.example.expected,
    [config.observed.id]: config.example.observed,
  };
  const example = {
    input: exampleInput,
    output: calculate(exampleInput),
  } satisfies ToolExample<Input, Output>;
  const tool = createSimpleTool({
    calculate: (input) =>
      calculate({
        [config.expected.id]: input[config.expected.id] as readonly string[],
        [config.observed.id]: input[config.observed.id] as readonly string[],
      }),
    description: config.description,
    id: config.id,
    inputs: [
      {
        id: config.expected.id,
        kind: "stringList",
        label: config.expected.label,
      },
      {
        id: config.observed.id,
        kind: "stringList",
        label: config.observed.label,
      },
    ],
    outputs: [
      {
        id: "coveragePercent",
        kind: "number",
        label: "Coverage",
        minimum: 0,
        maximum: 100,
        unit: "%",
      },
      { id: "matched", kind: "stringList", label: "Matched items" },
      { id: "missing", kind: "stringList", label: "Missing items" },
      { id: "unexpected", kind: "stringList", label: "Unexpected items" },
    ],
    title: config.title,
  });
  return { calculate, example, tool };
};

export const createRiskScreen = (config: {
  readonly description: string;
  readonly example: Readonly<Record<string, boolean>>;
  readonly highRiskAt: number;
  readonly id: string;
  readonly indicators: readonly Readonly<{ id: string; label: string }>[];
  readonly title: string;
}) => {
  type Input = Readonly<Record<string, boolean>>;
  type Output = Readonly<{
    indicatorCount: number;
    indicators: readonly string[];
    riskLevel: "none" | "caution" | "high";
  }>;
  const calculate = (input: Input): Output => {
    const indicators = config.indicators
      .filter((item) => input[item.id])
      .map((item) => item.id);
    return {
      indicatorCount: indicators.length,
      indicators,
      riskLevel:
        indicators.length === 0
          ? "none"
          : indicators.length >= config.highRiskAt
            ? "high"
            : "caution",
    };
  };
  const example = {
    input: config.example,
    output: calculate(config.example),
  } satisfies ToolExample<Input, Output>;
  const tool = createSimpleTool({
    calculate: (input) =>
      calculate(
        Object.fromEntries(
          config.indicators.map((item) => [item.id, input[item.id] as boolean]),
        ),
      ),
    description: config.description,
    id: config.id,
    inputs: config.indicators.map((item) => ({
      ...item,
      kind: "boolean" as const,
    })),
    outputs: [
      {
        id: "indicatorCount",
        kind: "integer",
        label: "Indicator count",
        minimum: 0,
      },
      { id: "indicators", kind: "stringList", label: "Triggered indicators" },
      {
        id: "riskLevel",
        kind: "string",
        label: "Risk level",
        enum: ["none", "caution", "high"],
      },
    ],
    title: config.title,
  });
  return { calculate, example, tool };
};

export const createTwoWayClassifier = (config: {
  readonly description: string;
  readonly example: Readonly<Record<string, boolean>>;
  readonly first: Readonly<{ label: string; value: string }>;
  readonly id: string;
  readonly indicators: readonly Readonly<{
    id: string;
    label: string;
    side: "first" | "second";
  }>[];
  readonly second: Readonly<{ label: string; value: string }>;
  readonly title: string;
}) => {
  type Input = Readonly<Record<string, boolean>>;
  type Output = Readonly<{
    classification: string;
    firstScore: number;
    secondScore: number;
  }>;
  const calculate = (input: Input): Output => {
    const firstScore = config.indicators.filter(
      (item) => item.side === "first" && input[item.id],
    ).length;
    const secondScore = config.indicators.filter(
      (item) => item.side === "second" && input[item.id],
    ).length;
    const classification =
      firstScore === 0 && secondScore === 0
        ? "insufficient-evidence"
        : firstScore === secondScore
          ? "mixed-evidence"
          : firstScore > secondScore
            ? config.first.value
            : config.second.value;
    return { classification, firstScore, secondScore };
  };
  const example = {
    input: config.example,
    output: calculate(config.example),
  } satisfies ToolExample<Input, Output>;
  const tool = createSimpleTool({
    calculate: (input) =>
      calculate(
        Object.fromEntries(
          config.indicators.map((item) => [item.id, input[item.id] as boolean]),
        ),
      ),
    description: config.description,
    id: config.id,
    inputs: config.indicators.map((item) => ({
      id: item.id,
      kind: "boolean" as const,
      label: item.label,
    })),
    outputs: [
      {
        id: "classification",
        kind: "string",
        label: "Classification",
        enum: [
          config.first.value,
          config.second.value,
          "mixed-evidence",
          "insufficient-evidence",
        ],
      },
      {
        id: "firstScore",
        kind: "integer",
        label: config.first.label,
        minimum: 0,
      },
      {
        id: "secondScore",
        kind: "integer",
        label: config.second.label,
        minimum: 0,
      },
    ],
    title: config.title,
  });
  return { calculate, example, tool };
};

export const createRangeScreen = (config: {
  readonly description: string;
  readonly example: Readonly<{
    maximum: number;
    minimum: number;
    value: number;
  }>;
  readonly id: string;
  readonly maximum: Readonly<{ id: string; label: string; unit?: string }>;
  readonly minimum: Readonly<{ id: string; label: string; unit?: string }>;
  readonly title: string;
  readonly value: Readonly<{ id: string; label: string; unit?: string }>;
}) => {
  type Input = Readonly<Record<string, number>>;
  type Output = Readonly<{
    marginToMaximum: number;
    marginToMinimum: number;
    withinRange: boolean;
  }>;
  const calculate = (input: Input): Output => {
    const value = input[config.value.id];
    const minimum = input[config.minimum.id];
    const maximum = input[config.maximum.id];
    if (minimum > maximum)
      simpleError(
        config.minimum.id,
        "Minimum cannot exceed maximum.",
        "invalid_range",
      );
    return {
      marginToMaximum: finiteResult("marginToMaximum", maximum - value),
      marginToMinimum: finiteResult("marginToMinimum", value - minimum),
      withinRange: value >= minimum && value <= maximum,
    };
  };
  const exampleInput: Input = {
    [config.value.id]: config.example.value,
    [config.minimum.id]: config.example.minimum,
    [config.maximum.id]: config.example.maximum,
  };
  const example = {
    input: exampleInput,
    output: calculate(exampleInput),
  } satisfies ToolExample<Input, Output>;
  const fields: readonly SimpleField[] = [
    { ...config.value, kind: "number" },
    { ...config.minimum, kind: "number" },
    { ...config.maximum, kind: "number" },
  ];
  const tool = createSimpleTool({
    calculate: (input) =>
      calculate(
        Object.fromEntries(
          fields.map((field) => [field.id, input[field.id] as number]),
        ),
      ),
    description: config.description,
    id: config.id,
    inputs: fields,
    outputs: [
      {
        id: "marginToMaximum",
        kind: "number",
        label: "Margin to maximum",
        unit: config.value.unit,
      },
      {
        id: "marginToMinimum",
        kind: "number",
        label: "Margin to minimum",
        unit: config.value.unit,
      },
      { id: "withinRange", kind: "boolean", label: "Within range" },
    ],
    title: config.title,
  });
  return { calculate, example, tool };
};

export const createBinaryMetric = (config: {
  readonly description: string;
  readonly example: Readonly<{ first: number; second: number }>;
  readonly first: Readonly<{
    id: string;
    label: string;
    minimum?: number;
    unit?: string;
  }>;
  readonly formula: "difference" | "percent-of" | "percent-ratio" | "ratio";
  readonly id: string;
  readonly output: Readonly<{
    id: string;
    label: string;
    minimum?: number;
    unit?: string;
  }>;
  readonly second: Readonly<{
    id: string;
    label: string;
    minimum?: number;
    unit?: string;
  }>;
  readonly title: string;
}) => {
  type Input = Readonly<Record<string, number>>;
  type Output = Readonly<Record<string, number>>;
  const calculate = (input: Input): Output => {
    const first = input[config.first.id];
    const second = input[config.second.id];
    if (
      (config.formula === "ratio" || config.formula === "percent-ratio") &&
      second === 0
    )
      simpleError(
        config.second.id,
        "The denominator must not be zero.",
        "division_by_zero",
      );
    const raw =
      config.formula === "difference"
        ? first - second
        : config.formula === "percent-of"
          ? (first * second) / 100
          : config.formula === "percent-ratio"
            ? (first / second) * 100
            : first / second;
    return { [config.output.id]: finiteResult(config.output.id, raw) };
  };
  const exampleInput: Input = {
    [config.first.id]: config.example.first,
    [config.second.id]: config.example.second,
  };
  const example = {
    input: exampleInput,
    output: calculate(exampleInput),
  } satisfies ToolExample<Input, Output>;
  const tool = createSimpleTool({
    calculate: (input) =>
      calculate({
        [config.first.id]: input[config.first.id] as number,
        [config.second.id]: input[config.second.id] as number,
      }),
    description: config.description,
    id: config.id,
    inputs: [
      { ...config.first, kind: "number" },
      { ...config.second, kind: "number" },
    ],
    outputs: [{ ...config.output, kind: "number" }],
    title: config.title,
  });
  return { calculate, example, tool };
};

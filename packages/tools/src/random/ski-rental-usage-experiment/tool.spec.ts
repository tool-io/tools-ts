import { expect, it } from "vitest";
import tool, {
  calculateSkiRentalUsageExperiment,
  skiRentalUsageExperimentExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateSkiRentalUsageExperiment, example);
it("agrees with independent day-by-day costs and exhaustive hindsight choice", () => {
  for (let days = 0; days <= 8; days += 1) {
    const result = calculateSkiRentalUsageExperiment({
      ...example.input,
      count: 1,
      minimumDays: days,
      maximumDays: days,
    });
    if (!result.ok) throw new Error("expected fixed horizon");
    let online = 0;
    for (let day = 1; day <= days; day += 1) {
      if (day < 4) online += 10;
      else if (day === 4) online += 40;
    }
    const options = [days * 10];
    for (let buyDay = 1; buyDay <= days; buyDay += 1)
      options.push((buyDay - 1) * 10 + 40);
    expect(result.output.trials[0].result.onlineCost).toBe(online);
    expect(result.output.trials[0].result.optimalCost).toBe(
      Math.min(...options),
    );
    expect(result.output.trials[0].ratio).toBe(
      days === 0 ? 1 : online / Math.min(...options),
    );
  }
});
it("implements the shifted censored geometric CDF including both bounds", () => {
  let cursor = 0;
  const samples = [0, 0.49, 0.5, 0.74, 0.75, 0.875, 0.999];
  const result = calculateSkiRentalUsageExperiment(
    {
      count: 7,
      minimumDays: 2,
      maximumDays: 5,
      distribution: "censored-geometric",
      stopProbability: 0.5,
      rentalCost: 10,
      purchaseCost: 40,
    },
    { random: () => samples[cursor++] },
  );
  if (!result.ok) throw new Error("expected geometric experiment");
  expect(cursor).toBe(7);
  expect(result.output.trials.map((trial) => trial.usageDays)).toEqual([
    2, 2, 3, 3, 4, 5, 5,
  ]);
  const stopped = calculateSkiRentalUsageExperiment({
    ...example.input,
    distribution: "censored-geometric",
    stopProbability: 1,
  });
  if (!stopped.ok) throw new Error("expected immediate stop");
  expect(
    stopped.output.trials.every(
      (trial) => trial.usageDays === 0 && trial.ratio === 1,
    ),
  ).toBe(true);
});
it("rejects missing probabilities, representability failures and excessive output", () => {
  expect(
    tool.execute({ ...example.input, distribution: "censored-geometric" }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "missing_stop_probability", field: "stopProbability" }],
    },
  });
  expect(
    tool.execute({
      ...example.input,
      purchaseCost: Number.MAX_VALUE,
      rentalCost: Number.MIN_VALUE,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "unrepresentable_purchase_day", field: "purchaseCost" }],
    },
  });
  expect(
    tool.execute({
      ...example.input,
      purchaseCost: Number.MAX_VALUE,
      rentalCost: Number.MAX_VALUE / 4,
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "numeric_overflow", field: "purchaseCost" }] },
  });
  expect(
    tool.execute({ ...example.input, minimumDays: 8, maximumDays: 4 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "invalid_integer_range", field: "maximumDays" }],
    },
  });
  expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});

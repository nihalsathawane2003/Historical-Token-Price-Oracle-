exports.interpolatePrice = (ts) => {
  const base = 1.0;
  const fluctuation = Math.sin(ts / 1000000) * 0.1;
  return base + fluctuation;
};

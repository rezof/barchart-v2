import * as d3 from "d3";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const monthNameOfDate = date => {
  const month = new Date(date).getMonth();
  return months[month];
};

export const monthOfDate = date => {
  return new Date(date).getMonth();
};

export const createTimeScale = (dt, width) => {
  // const domain = dt.map(item => monthOfDate(item.key));
  return d3
    .scaleBand()
    .domain(Array.from({ length: 12 }).map((v_, i) => i))
    .rangeRound([0, width])
    .padding(0.4);
};

export const createLinearScale = (dt, height) => {
  const valuesRange = dt.map(({ values }) =>
    values.reduce((acc, cur) => acc + cur.value, 0)
  );
  let [min, max] = d3.extent(valuesRange);
  min = min + (10 - min % 10);
  max = max + (10 - max % 10);
  return d3
    .scaleLinear()
    .domain([min, max])
    .rangeRound([height, 0]);
};

export const createTopAxis = (scale, height) => {
  return d3.axisTop(scale); //.tickSize(height);
};

export const createRightAxis = (scale, width) => {
  return (
    d3
      .axisRight(scale)
      // .ticks(8)
      .tickSize(width)
  );
};

export const createBarChart = dt => {
  const keys = dt.map(item => item.y);
  return d3.stack().keys(keys)(dt);
};

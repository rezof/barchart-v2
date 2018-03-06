import React from "react";
import * as d3 from "d3";

import data from "./data";
import {
  monthOfDate,
  createTimeScale,
  createTopAxis,
  createLinearScale,
  createRightAxis,
  createBarChart
} from "./util";

class Chart extends React.Component {
  componentDidMount() {
    let dt = data
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(dt => ({ ...dt, date: +new Date(dt.date) }));

    dt = d3
      .nest()
      .key(entry => d3.timeMonth(entry.date))
      .entries(dt);

    const svg = d3.select(this._svg);
    const margin = { top: 40, left: 40 };
    const width = svg.attr("width") - margin.left;
    const height = svg.attr("height") - margin.top;
    const g = svg.append("g");
    const x = createTimeScale(dt, width);
    const y = createLinearScale(dt, height);
    const xAxis = createTopAxis(x, height);
    const yAxis = createRightAxis(y, width);

    // X axis
    const xGroupe = g.append("g").call(xAxis);
    // .attr("transform", `translate(-12, ${height} )`);

    xGroupe.select(".domain").remove();

    xGroupe
      .selectAll(".tick text")
      .attr("dy", height + margin.top / 2)
      .attr("dx", x.bandwidth() * 4 / 5);

    xGroupe
      .selectAll(".tick line")
      .attr("stroke", "#bbbbbb")
      .attr("stroke-dasharray", "5");

    xGroupe
      .select(".tick:first-of-type line")
      .attr("stroke", "#000")
      .attr("stroke-dasharray", "5, 1")
      .attr("stroke-width", 2);

    // Y axis
    const yGroupe = g
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

    yGroupe.select(".domain").remove();

    yGroupe
      .selectAll(".tick text")
      .attr("x", -40)
      .attr("dy", 5);

    yGroupe
      .selectAll(".tick line")
      .attr("stroke", "#bbbbbb")
      .attr("stroke-dasharray", "5");

    yGroupe
      .select(".tick:first-of-type line")
      .attr("stroke", "#000")
      .attr("stroke-dasharray", "5, 1")
      .attr("stroke-width", 2);

    g
      .selectAll(".tick text")
      .style("font-size", 10)
      .style("font-weight", 100);

    // stacks
    const _data = dt.map(({ key, values }) => {
      return {
        x: new Date(key),
        y: values.reduce((acc, cur) => acc + cur.value, 0)
      };
    });

    const bars = g.append("g").attr("class", "bars");
    bars
      .selectAll(".rect")
      .data(_data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("month", item => monthOfDate(item.x))
      .attr("fill", "#bbb")
      .attr("x", item => {
        return x(monthOfDate(item.x)) + x.bandwidth() * 4 / 5;
      })
      .attr("y", item => y(item.y) + 2)
      .attr("width", x.bandwidth())
      .attr("height", item => height - y(item.y));
  }

  render() {
    return <svg width="960" height="480" ref={ref => (this._svg = ref)} />;
  }
}

export default Chart;

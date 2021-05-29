import React, { useRef, useState } from 'react';
import styles from "./styles.module.css";
import { calcPath } from './lib/model';
import { ConvertedData } from "./testGraphData";
import { ChartProps } from './types/types';
import { interpolatePath } from "d3-interpolate-path";
const d3 = require("d3");


export const Chart = ({ width, height, data }: ChartProps) => {
  const [chartState, setChartState] = useState(0);
  const pathData = calcPath(ConvertedData.chartData[chartState], width, height);
  const currentPathString = pathData.path;
  const graphRef = useRef(null);

  const handleChartChangeClick = (key: number) => {
    let previous = currentPathString;
    let current = calcPath(ConvertedData.chartData[key], width, height);
    let interpolatedPathData = interpolatePath(previous, current.path);

    d3.select(graphRef.current)
      .attr('d', previous)
      .transition()
      .duration(1000)
      .attrTween('d', () => interpolatedPathData)
      .on('end', () => {
        setChartState(key);
      });
}

  return(
    <div className={styles.chartContainer} style={{ width, height }}>
      <svg width={width} height={height}>
        <path
          d={pathData !== null ? currentPathString : ""}
          style={{ fill: "transparent", stroke: "blue", strokeWidth: 4 }}
          ref={graphRef}
        />
      </svg>
      { data.chartLabels === null ? null :
        <div className={styles.buttonContainer}>
          {data.chartLabels.map((value, index) => (
            <button
              className={styles.chartButton}
              style={index==chartState ? {color: "gray", cursor: "not-allowed"} : {}}
              key={index}
              onClick={() => handleChartChangeClick(index)}
            >{value}</button>
          ))}
        </div>
      }
    </div>
  );
}
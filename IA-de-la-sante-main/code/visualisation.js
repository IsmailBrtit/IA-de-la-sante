// Load the data
d3.csv("data.csv").then(function(data) {
    // Parse the data
    data.forEach(function(d) {
        d.radius_mean = +d.radius_mean;
        d.texture_mean = +d.texture_mean;
        d.perimeter_mean = +d.perimeter_mean;
        d.area_mean = +d.area_mean;
        d.smoothness_mean = +d.smoothness_mean;
        d.compactness_mean = +d.compactness_mean;
        d.concavity_mean = +d.concavity_mean;
        d.concave_points_mean = +d.concave_points_mean;
        d.radius_worst = +d.radius_worst;
        d.texture_worst = +d.texture_worst;
        d.perimeter_worst = +d.perimeter_worst;
        d.area_worst = +d.area_worst;
        d.smoothness_worst = +d.smoothness_worst;
        d.compactness_worst = +d.compactness_worst;
        d.concavity_worst = +d.concavity_worst;
        d.concave_points_worst = +d.concave_points_worst;
        d.symmetry_worst = +d.symmetry_worst;
        d.fractal_dimension_worst = +d.fractal_dimension_worst;
        d.diagnosis = d.diagnosis === "M" ? 1 : 0;
    });

    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = 400 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const color = d3.scaleOrdinal()
                    .domain([0, 1])
                    .range(["#1f77b4", "#ff7f0e"]);

    const colorName = {
        0: "Benign",
        1: "Malignant"
    };

    const features = [
        "radius_mean", "texture_mean", "perimeter_mean", "area_mean",
        "smoothness_mean", "compactness_mean", "concavity_mean", "concave_points_mean",
        "radius_worst", "texture_worst", "perimeter_worst", "area_worst",
        "smoothness_worst", "compactness_worst", "concavity_worst", "concave_points_worst",
        "symmetry_worst", "fractal_dimension_worst"
    ];

    const pairs = [
        ["radius_mean", "texture_mean"],
        ["radius_mean", "perimeter_mean"],
        ["texture_mean", "perimeter_mean"]
    ];

    const createScatterPlot = (pair, containerId) => {
        const svg = d3.select(`#${containerId}`)
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[pair[0]])])
                    .range([0, width]);

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));

        svg.append("text")
           .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
           .style("text-anchor", "middle")
           .text(pair[0]);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[pair[1]])])
                    .range([height, 0]);

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", -margin.left)
           .attr("x", -height / 2)
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .text(pair[1]);

        svg.append('g')
           .selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => x(d[pair[0]]))
           .attr("cy", d => y(d[pair[1]]))
           .attr("r", 3)
           .style("fill", d => color(d.diagnosis));

        const legend = svg.selectAll(".legend")
                          .data(color.domain())
                          .enter().append("g")
                          .attr("class", "legend")
                          .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

        legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(d => colorName[d]);
    };

    pairs.forEach((pair, i) => createScatterPlot(pair, `scatterPlot${i+1}`));

    const createDensityPlot = (feature, containerId) => {
        const svg = d3.select(`#${containerId}`)
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[feature])])
                    .range([0, width]);

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));

        svg.append("text")
           .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
           .style("text-anchor", "middle")
           .text(feature);

        const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
        const density1 = kde(data.filter(d => d.diagnosis === 0).map(d => d[feature]));
        const density2 = kde(data.filter(d => d.diagnosis === 1).map(d => d[feature]));

        const y = d3.scaleLinear()
                    .domain([0, d3.max([...density1, ...density2], d => d[1])])
                    .range([height, 0]);

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("path")
           .datum(density1)
           .attr("fill", "#1f77b4")
           .attr("opacity", ".5")
           .attr("stroke", "none")
           .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(d => x(d[0]))
                        .y(d => y(d[1])));

        svg.append("path")
           .datum(density2)
           .attr("fill", "#ff7f0e")
           .attr("opacity", ".5")
           .attr("stroke", "none")
           .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(d => x(d[0]))
                        .y(d => y(d[1])));

        const legend = svg.selectAll(".legend")
                          .data(color.domain())
                          .enter().append("g")
                          .attr("class", "legend")
                          .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

        legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(d => colorName[d]);
    };

    features.slice(0, 4).forEach((feature, i) => createDensityPlot(feature, `densityPlot${i+1}`));

    const svgBar = d3.select("#barChart")
                     .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                     .attr("transform", `translate(${margin.left},${margin.top})`);

    const diagnosisCounts = d3.rollups(data, v => v.length, d => d.diagnosis);

    const xBar = d3.scaleBand()
                   .domain(diagnosisCounts.map(d => d[0]))
                   .range([0, width])
                   .padding(0.1);

    const yBar = d3.scaleLinear()
                   .domain([0, d3.max(diagnosisCounts, d => d[1])])
                   .range([height, 0]);

    svgBar.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xBar).tickFormat(d => d === 0 ? "Benign" : "Malignant"));

    svgBar.append("g")
          .call(d3.axisLeft(yBar));

    svgBar.selectAll(".bar")
          .data(diagnosisCounts)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xBar(d[0]))
          .attr("y", d => yBar(d[1]))
          .attr("width", xBar.bandwidth())
          .attr("height", d => height - yBar(d[1]))
          .attr("fill", d => d[0] === 0 ? "#1f77b4" : "#ff7f0e");

    // Add axis labels
    svgBar.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
          .style("text-anchor", "middle")
          .text("Diagnosis");

    svgBar.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Count");

    // Legend
    const legendBar = svgBar.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legendBar.append("rect")
             .attr("x", width - 18)
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", color);

    legendBar.append("text")
             .attr("x", width - 24)
             .attr("y", 9)
             .attr("dy", ".35em")
             .style("text-anchor", "end")
             .text(d => colorName[d]);
});

// Kernel density estimation functions
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? .75 * (1 - v * v) / k : 0;
    };
}


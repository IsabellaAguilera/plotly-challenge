// @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildMetadata(sample) {
  var metaURL = "/metadata/" + sample;
  

  d3.json(metaURL).then(function(sample) {
    console.log(sample);
    var metaData = d3.select(`#sample-metadata`)

    metaData.html("");
    
    Object.entries(sample).forEach(([key,value]) => {
      var row = metaData.append("p")
      row.text(`${key}:${value}`)
    });

  });

}

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function buildCharts(sample) {

  var sampleURL = "/samples/" + sample;

  d3.json(sampleURL).then((data) => {
    console.log(data);

    var bubbleX = data.otu_ids;
    var bubbleY = data.sample_values;
    var bubbleSize = data.sample_values;
    var bubbleColor = data.otu_ids;
    var bubbleLabels = data.otu_labels;

    var pieValues = data.sample_values.slice(0,10);
    var pieID = data.otu_ids.slice(0,10);
    var pieLabels = data.otu_labels.slice(0,10);

    var trace1 = {
      x: bubbleX,
      y: bubbleY,
      hovertext: bubbleLabels,
      mode: `markers`,
      marker: {
        size: bubbleSize,
        color: bubbleColor
      }

    };

    var data1 = [trace1];
    var layout1 = {
      title: "Belly Button Bacteria",
      xaxis: {
        title: "OTU ID"
      }
    };
    
    Plotly.newPlot("bubble", data1, layout1);

    var trace2 = {
      type: `pie`,
      labels: pieID,
      values: pieValues,
      hovertext: pieLabels,
      name: "OTU IDS"
    };

    var data2 = [trace2]
    var layout2 = {
      title: "Top 10 Samples"
    };

   Plotly.newPlot("pie", data2, layout2);

  });


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

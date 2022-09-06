function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();



function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}



// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);

    var sel_wfreq = result.wfreq;
    // console.log("wfreq: ",sel_wfreq);
  
    // console.log(result);
    });

  });
}




// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log(samples);

    // 4. Create a variable that filters the samples 
    // for the object with the desired sample number.
    var samplesResultsArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var samplesResultTemp = samplesResultsArray[0];
    // console.log(samplesResultTemp);



// /////////////////// bar    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // /////////////////////// Slicing here, while all elements of array are 
    // /////////////////////// synchronized, and in same order.
    var sel_otu_ids =  samplesResultTemp.otu_ids.slice(0,10);
    var sel_otu_labels =  samplesResultTemp.otu_labels.slice(0,10);
    var sel_sample_values =  samplesResultTemp.sample_values.slice(0,10);
    // console.log("ids: ", sel_otu_ids, "labels: ", sel_otu_labels, "values: ", sel_sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sel_otu_ids =  sel_otu_ids.reverse();
    var sel_otu_labels =  sel_otu_labels.reverse();
    var sel_sample_values =  sel_sample_values.reverse();

    // var yticks = sel_otu_ids.map(["OTU ", sel_otu_ids]);
    // ////// Got help from AskBCU on this line:
    var yticks = sel_otu_ids.map(sel_otu_ids => `OTU ${sel_otu_ids}`);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sel_sample_values,
      y: yticks,
      marker:{
        // from bottom to top:
        color: [
          "darkslateblue", 
          "slateblue",
          "blue",
          "mediumslateblue",
          "blueviolet",
          "royalblue",
          "cornflowerblue",
          "lightsteelblue",
          "steelblue",
          "lightblue"
        ]
      },
      text: sel_otu_labels,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    


// /////////////////// bubble
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sel_otu_ids,
      y: yticks,
      text: sel_otu_labels,
      type: "bubble",
      mode: "markers",
      marker: {
        color: sel_otu_ids,
        size: sel_sample_values,
        colorscale: "RdBu"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: sel_otu_labels,
      xaxis: {
        title: "OTU ID"
      },
      margin: {
        l: 80,
        r: 50,
        b: 100,
        t: 50,
        // pad: 40
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);



// /////////////////// gauge
    // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var sel_wfreq = parseFloat(result.wfreq);
    console.log(sel_wfreq);

    // // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: sel_wfreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black"},
        bar: { color: "black"},
        steps: [
          { range: [0, 2], color: "fuchsia" },
          { range: [2, 4], color: "violet" },
          { range: [4, 6], color: "plum" },
          { range: [6, 8], color: "mediumorchid" },
          { range: [8, 10], color: "darkorchid" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 400, height: 400, margin: { t: 0, b: 0}
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


  });
}


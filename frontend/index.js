// set the dimensions and margins of the graph
const TEAM = "team"
const SERVICE = "service"
const OWNS = "owns"
const CONSUMES = "consumes"

const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


const data = {
    nodes: [
        {
            id: "team 1",
            type: TEAM
        },
        {
            id: "team 2",
            type: TEAM
        },
        {
            id: "service 1",
            type: SERVICE
        },
        {
            id: "service 2",
            type: SERVICE
        },
        {
            id: "service 3",
            type: SERVICE
        },
    ],
    links: [
        {
            source: "team 1",
            target: "service 1",
            type: OWNS
        },
        {
            source: "team 2",
            target: "service 2",
            type: OWNS
        },
        {
            source: "team 1",
            target: "service 3",
            type: OWNS
        },
        {
            source: "service 2",
            target: "service 1",
            type: CONSUMES
        },
        {
            source: "service 3",
            target: "service 1",
            type: CONSUMES
        },
    ]
}

const colorNodes = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([TEAM, SERVICE])
    .range(d3.schemeSet1)

const lineType = (type) => type === OWNS ? "1" : "5,5"

// Initialize the links
const links = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-dasharray", link => lineType(link.type))

const nodes = svg
    .selectAll("rect")
    .data(data.nodes)
    .enter()
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => colorNodes(d.type))

const force = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
        .links(data.links)                                    // and this the list of links
        .id(link => link.id)                     // This provide  the id of a node
    )
    .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area

simulation = force.on("tick", () => {
    links
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y);

    nodes
        .attr("x", node => node.x - 10)
        .attr("y", node => node.y - 10)
});


